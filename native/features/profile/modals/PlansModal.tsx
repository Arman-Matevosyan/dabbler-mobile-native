import { useTheme } from '@/design-system';
import { usePlans } from '@/hooks/usePlans';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ProfileStackParamList } from '@/navigation/types';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const PlanSkeleton = ({ colors }: { colors: any }) => {
  return (
    <View style={[styles.planCard, { borderColor: colors.border }]}>
      <View style={styles.planHeader}>
        <View
          style={[styles.skeletonText, { backgroundColor: colors.skeletonBackground, width: 100 }]}
        />
        <View
          style={[styles.skeletonText, { backgroundColor: colors.skeletonBackground, width: 80 }]}
        />
      </View>
      <View
        style={[
          styles.skeletonText,
          {
            backgroundColor: colors.skeletonBackground,
            height: 60,
            marginTop: 10,
          },
        ]}
      />
    </View>
  );
};

interface PlansModalProps {
  onClose?: () => void;
  forceShow?: boolean;
}

export default function PlansModal({ onClose, forceShow = false }: PlansModalProps) {
  const { colors } = useTheme();
  const router =
    useNavigation<NativeStackNavigationProp<RootStackParamList & ProfileStackParamList>>();
  const { data: plans = [], isLoading } = usePlans();
  const { showSubscriptionModal, setShowSubscriptionModal } = useAuthStore();
  const { t } = useTranslation();

  const isVisible = forceShow || showSubscriptionModal;

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setShowSubscriptionModal(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSelectPlan = (plan: any) => {
    setShowSubscriptionModal(false);
    if (onClose) {
      onClose();
    }

    const planId = typeof plan.id === 'string' ? plan.id : plan.planId;

    router.navigate('PaymentScreens', {
      screen: 'ProcessPayment',
      params: { plan: planId },
    });
  };

  const handleViewAllPlans = () => {
    setShowSubscriptionModal(false);
    if (onClose) {
      onClose();
    }

    router.navigate('Plans');
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
            <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={e => {
                  e.stopPropagation();
                }}>
                <View style={[styles.modalView, { backgroundColor: colors.background }]}>
                  <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                      {t('plans.chooseYourPlan')}
                    </Text>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={styles.closeButton}
                      activeOpacity={1}>
                      <MaterialIcons name="close" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {t('plans.choosePlan')}
                  </Text>

                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={colors.accent} style={styles.loader} />
                      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        {t('plans.loadingPlans')}
                      </Text>
                      <PlanSkeleton colors={colors} />
                      <PlanSkeleton colors={colors} />
                    </View>
                  ) : (
                    <ScrollView style={styles.plansContainer}>
                      {plans && plans.length > 0 ? (
                        plans.map((plan: any, index: number) => {
                          const isPopular = index === 1;
                          return (
                            <TouchableOpacity
                              key={plan.id || plan.planId}
                              style={[
                                styles.planCard,
                                {
                                  borderColor: isPopular ? colors.accent : colors.border,
                                  borderWidth: isPopular ? 2 : 1,
                                },
                              ]}
                              onPress={() => handleSelectPlan(plan)}
                              activeOpacity={1}>
                              {isPopular && (
                                <View
                                  style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
                                  <Text style={styles.popularText}>{t('plans.mostPopular')}</Text>
                                </View>
                              )}
                              <View style={styles.planHeader}>
                                <Text style={[styles.planName, { color: colors.textPrimary }]}>
                                  {plan.name}
                                </Text>
                                <Text style={[styles.planPrice, { color: colors.accent }]}>
                                  {plan.currencyIsoCode} {plan.price}
                                  {t('plans.perMonth')}
                                </Text>
                              </View>
                              <Text
                                style={[styles.planDescription, { color: colors.textSecondary }]}>
                                {plan.description || t('plans.noDescription')}
                              </Text>
                            </TouchableOpacity>
                          );
                        })
                      ) : (
                        <Text style={[styles.noPlansText, { color: colors.textSecondary }]}>
                          {t('common.noResults')}
                        </Text>
                      )}
                    </ScrollView>
                  )}

                  <View style={styles.footer}>
                    <TouchableOpacity
                      style={[styles.viewAllButton, { backgroundColor: colors.accent }]}
                      onPress={handleViewAllPlans}
                      activeOpacity={1}>
                      <Text style={styles.viewAllButtonText}>{t('membership.viewPlans')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.skipButton}
                      onPress={handleClose}
                      activeOpacity={1}>
                      <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                        {t('common.cancel')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  loadingContainer: {
    marginBottom: 20,
  },
  loader: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  skeletonText: {
    height: 20,
    borderRadius: 4,
    marginVertical: 4,
  },
  plansContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  planCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'visible',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 5,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 8,
  },
  viewAllButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
  },
  noPlansText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
});
