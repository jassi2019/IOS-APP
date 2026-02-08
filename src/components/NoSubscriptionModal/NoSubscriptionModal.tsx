import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export const NoSubscriptionAlertModal = ({
  showPremiumModal,
  setShowPremiumModal,
}: {
  showPremiumModal: boolean;
  setShowPremiumModal: (value: boolean) => void;
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={showPremiumModal}
    onRequestClose={() => setShowPremiumModal(false)}
  >
    <TouchableWithoutFeedback onPress={() => setShowPremiumModal(false)}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View className="bg-white w-[85%] rounded-2xl p-6">
            <Text className="text-2xl font-bold text-center mb-2">
              You don't have premium subscription!
            </Text>

            <Text className="text-gray-500 text-center mb-6">
              Access premium content with premium subscription
            </Text>

            <TouchableOpacity
              className="bg-[#F4B95F] rounded-lg py-3 mb-4"
              onPress={() => {
                setShowPremiumModal(false);
              }}
            >
              <Text className="text-center text-base font-semibold">Upgrade To Pro</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);
