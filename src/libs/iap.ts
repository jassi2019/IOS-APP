import { Platform } from 'react-native';

type EventSubscription = { remove(): void };

type Purchase = {
  productId: string;
  transactionId: string;
  purchaseState?: string;
  originalTransactionIdentifierIOS?: string | null;
  environmentIOS?: string | null;
};

type PurchaseError = {
  code?: string;
  message: string;
  productId?: string | null;
};

export type TAppleIapSubscriptionPeriodUnitIOS = 'day' | 'week' | 'month' | 'year' | 'empty';

export type TAppleIapProductType = 'in-app' | 'subs';

export type TAppleIapProductTypeIOS =
  | 'consumable'
  | 'non-consumable'
  | 'auto-renewable-subscription'
  | 'non-renewing-subscription';

export type TAppleIapProduct = {
  id: string;
  title: string;
  description: string;
  displayPrice: string;
  currency: string;
  type: TAppleIapProductType;
  typeIOS?: TAppleIapProductTypeIOS | null;
  subscriptionPeriodNumberIOS?: string | null;
  subscriptionPeriodUnitIOS?: TAppleIapSubscriptionPeriodUnitIOS | null;
};

const IAP_NOT_AVAILABLE_MESSAGE =
  'In-app purchases are not available. Please use a development build (not Expo Go).';

let IapSdk: any = null;
if (Platform.OS !== 'web') {
  try {
    // Lazy require so web doesn't evaluate native code
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    IapSdk = require('react-native-iap');
  } catch {
    IapSdk = null;
  }
}

export type TAppleIapPurchase = {
  productId: string;
  transactionId: string;
  originalTransactionId?: string | null;
  environmentIOS?: string | null;
  receipt: string;
};

function requireIap() {
  if (!IapSdk) {
    throw new Error(IAP_NOT_AVAILABLE_MESSAGE);
  }
  return IapSdk;
}

export function isIapAvailable() {
  return !!IapSdk;
}

export function formatAppleSubscriptionPeriod(
  subscriptionPeriodNumberIOS?: string | null,
  subscriptionPeriodUnitIOS?: TAppleIapSubscriptionPeriodUnitIOS | null
): string | null {
  if (!subscriptionPeriodNumberIOS || !subscriptionPeriodUnitIOS) return null;
  if (subscriptionPeriodUnitIOS === 'empty') return null;

  const n = Number(subscriptionPeriodNumberIOS);
  if (!Number.isFinite(n) || n <= 0) return null;

  const unit =
    subscriptionPeriodUnitIOS === 'day'
      ? 'day'
      : subscriptionPeriodUnitIOS === 'week'
        ? 'week'
        : subscriptionPeriodUnitIOS === 'month'
          ? 'month'
          : subscriptionPeriodUnitIOS === 'year'
            ? 'year'
            : null;

  if (!unit) return null;
  const plural = n === 1 ? unit : `${unit}s`;
  return `${n} ${plural}`;
}

export async function fetchAppleSubscriptionProducts(
  productIds: string[]
): Promise<TAppleIapProduct[]> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple in-app purchases are only available on iOS.');
  }

  const skus = Array.from(new Set(productIds.filter(Boolean)));
  if (skus.length === 0) return [];

  const IAP = requireIap();

  const connected = await IAP.initConnection();
  if (!connected) {
    throw new Error('Failed to connect to the App Store.');
  }

  try {
    // Fetch both subscriptions and one-time products. We'll decide how to purchase based on `type`.
    const products = await IAP.fetchProducts({ skus, type: 'all' });
    if (!Array.isArray(products)) return [];

    const mapped = products
      .map((p: any): TAppleIapProduct => ({
      id: String(p?.id ?? ''),
      title: String(p?.title ?? ''),
      description: String(p?.description ?? ''),
      displayPrice: String(p?.displayPrice ?? ''),
      currency: String(p?.currency ?? ''),
      type: (p?.type === 'subs' ? 'subs' : 'in-app') as TAppleIapProductType,
      typeIOS: (p?.typeIOS ?? null) as TAppleIapProductTypeIOS | null,
      subscriptionPeriodNumberIOS: p?.subscriptionPeriodNumberIOS ?? null,
      subscriptionPeriodUnitIOS: p?.subscriptionPeriodUnitIOS ?? null,
    }))
      .filter((p: any) => !!p?.id);

    if (mapped.length === 0) {
      throw new Error(
        'No products returned from the App Store. ' +
          'Check that the product exists in App Store Connect, is Cleared for Sale, ' +
          'and that your iOS bundle identifier matches the app in App Store Connect.'
      );
    }

    return mapped;
  } finally {
    try {
      await IAP.endConnection();
    } catch {
      // noop
    }
  }
}

async function getAppleReceiptInternal(IAP: any): Promise<string | null> {
  let receipt: string | null = null;

  try {
    receipt = await IAP.getReceiptIOS();
  } catch {
    receipt = null;
  }

  if (receipt) return receipt;

  try {
    receipt = await IAP.requestReceiptRefreshIOS();
  } catch {
    receipt = null;
  }

  return receipt;
}

export async function restoreAppleReceipt(): Promise<string> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple in-app purchases are only available on iOS.');
  }

  const IAP = requireIap();

  const connected = await IAP.initConnection();
  if (!connected) {
    throw new Error('Failed to connect to the App Store.');
  }

  try {
    try {
      await IAP.restorePurchases();
    } catch {
      // Restore can fail for reasons unrelated to receipt availability; continue to receipt fetch.
    }

    const receipt = await getAppleReceiptInternal(IAP);
    if (!receipt) {
      throw new Error('Could not fetch App Store receipt. Please try again.');
    }
    return receipt;
  } finally {
    try {
      await IAP.endConnection();
    } catch {
      // noop
    }
  }
}

export async function openAppleManageSubscriptions(): Promise<void> {
  if (Platform.OS !== 'ios') {
    throw new Error('Manage subscriptions is only available on iOS.');
  }

  const IAP = requireIap();

  const connected = await IAP.initConnection();
  if (!connected) {
    throw new Error('Failed to connect to the App Store.');
  }

  try {
    try {
      await IAP.showManageSubscriptionsIOS();
      return;
    } catch {
      // Fall back to deeplink API if showManageSubscriptionsIOS fails.
    }

    try {
      const ok = await IAP.deepLinkToSubscriptionsIOS();
      if (!ok) {
        throw new Error('Unable to open subscription management.');
      }
    } catch (e: any) {
      throw new Error(String(e?.message || e || 'Unable to open subscription management.'));
    }
  } finally {
    try {
      await IAP.endConnection();
    } catch {
      // noop
    }
  }
}

export async function purchaseAppleProduct(
  productId: string,
  type: TAppleIapProductType
): Promise<TAppleIapPurchase> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple in-app purchase is only available on iOS.');
  }

  const IAP = requireIap();

  const connected = await IAP.initConnection();
  if (!connected) {
    throw new Error('Failed to connect to the App Store.');
  }

  let purchaseSub: EventSubscription | null = null;
  let errorSub: EventSubscription | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const cleanup = async () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    try {
      purchaseSub?.remove();
    } catch {
      // noop
    }
    try {
      errorSub?.remove();
    } catch {
      // noop
    }
    purchaseSub = null;
    errorSub = null;
    try {
      await IAP.endConnection();
    } catch {
      // noop
    }
  };

  try {
    const result = await new Promise<TAppleIapPurchase>((resolve, reject) => {
      let settled = false;

      const settle = async (fn: () => Promise<void>) => {
        if (settled) return;
        settled = true;
        try {
          await fn();
        } catch (e) {
          reject(e);
          return;
        } finally {
          cleanup().catch(() => undefined);
        }
      };

      purchaseSub = IAP.purchaseUpdatedListener((purchase: Purchase) => {
        if (purchase.productId !== productId) return;

        // Some purchases can be "pending" (e.g., Ask to Buy). Wait for a purchased state.
        if (purchase.purchaseState && purchase.purchaseState !== 'purchased') return;

        settle(async () => {
          if (!purchase.transactionId) {
            throw new Error('Missing transaction ID from App Store purchase.');
          }

          let receipt: string | null = null;
          try {
            receipt = await IAP.getReceiptIOS();
          } catch {
            try {
              receipt = await IAP.requestReceiptRefreshIOS();
            } catch {
              receipt = null;
            }
          }

          if (!receipt) {
            throw new Error('Could not fetch App Store receipt. Please try again.');
          }

          await IAP.finishTransaction({ purchase });

          resolve({
            productId: purchase.productId,
            transactionId: purchase.transactionId,
            originalTransactionId: purchase.originalTransactionIdentifierIOS,
            environmentIOS: purchase.environmentIOS,
            receipt,
          });
        });
      });

      errorSub = IAP.purchaseErrorListener((error: PurchaseError) => {
        settle(async () => {
          throw error;
        });
      });

      timeout = setTimeout(() => {
        settle(async () => {
          throw new Error('Purchase timed out. Please try again.');
        });
      }, 2 * 60 * 1000);

      IAP.requestPurchase({
        type,
        request: {
          apple: {
            sku: productId,
            andDangerouslyFinishTransactionAutomatically: false,
          },
        },
      }).catch((e: any) => {
        settle(async () => {
          throw e;
        });
      });
    });

    await cleanup();
    return result;
  } catch (e) {
    await cleanup();
    throw e;
  }
}

// Backward-compat alias (older code used this name).
export async function purchaseAppleSubscription(productId: string): Promise<TAppleIapPurchase> {
  return purchaseAppleProduct(productId, 'subs');
}
