import { useGetAllPlans } from '@/hooks/api/plan';
import {
  fetchAppleSubscriptionProducts,
  formatAppleSubscriptionPeriod,
  isIapAvailable,
  type TAppleIapSubscriptionProduct,
} from '@/libs/iap';
import { TPlan } from '@/types/Plan';
import { AlertCircle, Check, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TPlanCardProps = {
  plan: TPlan;
  onSelect: (plan: TPlan) => void;
  isSelected: boolean;
  iapProduct?: TAppleIapSubscriptionProduct | null;
};

const INR_SYMBOL = '\u20B9';

const PlanCard = ({ plan, onSelect, isSelected, iapProduct }: TPlanCardProps) => {
  const features = plan.description
    .split('-')
    .filter((item) => item.trim())
    .map((item) => item.trim());

  const displayTitle =
    Platform.OS === 'ios' ? (iapProduct?.title || '').trim() || plan.name : plan.name;

  const billingPeriod = formatAppleSubscriptionPeriod(
    iapProduct?.subscriptionPeriodNumberIOS ?? null,
    iapProduct?.subscriptionPeriodUnitIOS ?? null
  );

  const priceText =
    Platform.OS === 'ios'
      ? iapProduct?.displayPrice || 'Price unavailable'
      : `${INR_SYMBOL}${plan.amount}`;

  const subText =
    Platform.OS === 'ios'
      ? billingPeriod
        ? `Billed every ${billingPeriod}`
        : 'Auto-renewing subscription'
      : `Valid until ${new Date(plan.validUntil).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}`;

  return (
    <TouchableOpacity
      onPress={() => onSelect(plan)}
      style={[
        styles.planCard,
        isSelected ? styles.planCardSelected : styles.planCardDefault,
      ]}
    >
      <View style={styles.planHeader}>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{displayTitle}</Text>
          <Text style={styles.planValidity}>{subText}</Text>
        </View>
        <View style={styles.planPricing}>
          <Text style={styles.planAmount}>{priceText}</Text>
          {Platform.OS !== 'ios' && <Text style={styles.planGst}>+ {plan.gstRate}% GST</Text>}
        </View>
      </View>

      <View style={styles.featuresList}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Check size={16} color="#F1BB3E" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export const PlansScreen = ({ navigation }: any) => {
  const [selectedPlan, setSelectedPlan] = React.useState<TPlan | null>(null);
  const { data, error, isLoading } = useGetAllPlans();

  const [iapProductsById, setIapProductsById] = React.useState<
    Record<string, TAppleIapSubscriptionProduct>
  >({});
  const [iapError, setIapError] = React.useState<string | null>(null);

  const iapReady = Platform.OS !== 'ios' ? true : isIapAvailable();

  const plans: TPlan[] = Array.isArray(data?.data) ? data.data : [];
  const visiblePlans = Platform.OS === 'ios' ? plans.filter((p) => !!p.appleProductId) : plans;
  const skuKey = React.useMemo(() => {
    if (Platform.OS !== 'ios') return '';
    const skus = plans.map((p) => p.appleProductId).filter(Boolean) as string[];
    const unique = Array.from(new Set(skus));
    unique.sort();
    return unique.join('|');
  }, [plans]);

  React.useEffect(() => {
    let cancelled = false;

    const loadIapProducts = async () => {
      if (Platform.OS !== 'ios') return;
      if (!iapReady) return;

      const skus = skuKey ? skuKey.split('|').filter(Boolean) : [];

      if (skus.length === 0) return;

      try {
        setIapError(null);
        const products = await fetchAppleSubscriptionProducts(skus);
        if (cancelled) return;

        const map: Record<string, TAppleIapSubscriptionProduct> = {};
        for (const p of products) {
          if (p?.id) map[p.id] = p;
        }
        setIapProductsById(map);
      } catch (e: any) {
        if (cancelled) return;
        setIapError(String(e?.message || e || 'Failed to load App Store prices.'));
      }
    };

    loadIapProducts();
    return () => {
      cancelled = true;
    };
  }, [iapReady, skuKey]);

  const handlePlanSelect = (plan: TPlan) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    if (!selectedPlan) return;
    navigation.navigate('Payment', { plan: selectedPlan });
  };

  const canContinue =
    !!selectedPlan &&
    (Platform.OS !== 'ios'
      ? true
      : !!selectedPlan.appleProductId && iapReady);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.innerContainer}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose your plan</Text>
            <Text style={styles.subtitle}>
              Select the perfect plan for your NEET preparation journey
            </Text>
          </View>

          {!iapReady && Platform.OS === 'ios' && (
            <View style={styles.noticeCard}>
              <AlertCircle size={20} color="#F59E0B" />
              <View style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>Development Build Required</Text>
                <Text style={styles.noticeText}>
                  In-app purchases require a development build. Expo Go does not support native IAP
                  modules.
                </Text>
              </View>
            </View>
          )}

          {!!iapError && Platform.OS === 'ios' && (
            <View style={styles.noticeCard}>
              <AlertCircle size={20} color="#EF4444" />
              <View style={styles.noticeContent}>
                <Text style={[styles.noticeTitle, { color: '#991B1B' }]}>Price Unavailable</Text>
                <Text style={[styles.noticeText, { color: '#991B1B' }]}>{iapError}</Text>
              </View>
            </View>
          )}

          <View style={styles.plansContainer}>
            {isLoading ? (
              <View style={styles.centerMessage}>
                <Text style={styles.messageText}>Loading plans...</Text>
              </View>
            ) : error ? (
              <View style={styles.centerMessage}>
                <Text style={styles.errorText}>Failed to load plans. Please try again later.</Text>
              </View>
            ) : visiblePlans.length === 0 ? (
              <View style={styles.centerMessage}>
                <Text style={styles.messageText}>No plans available at the moment.</Text>
              </View>
            ) : (
              visiblePlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={handlePlanSelect}
                  isSelected={selectedPlan?.id === plan.id}
                  iapProduct={plan.appleProductId ? iapProductsById[plan.appleProductId] : null}
                />
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!canContinue}
            style={[
              styles.continueButton,
              canContinue ? styles.continueButtonActive : styles.continueButtonDisabled,
            ]}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    marginVertical: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
  },
  plansContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  planCardDefault: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  planCardSelected: {
    borderWidth: 2,
    borderColor: '#F1BB3E',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  planValidity: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1BB3E',
  },
  planGst: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  centerMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  messageText: {
    fontSize: 18,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 16,
  },
  continueButtonActive: {
    backgroundColor: '#F1BB3E',
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    gap: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
});

export default PlansScreen;
