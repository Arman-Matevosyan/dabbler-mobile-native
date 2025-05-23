import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';
import { useTranslation } from 'react-i18next';

type Plan = {
  name?: string;
  limit?: number;
  description?: string;
};

const PlanChip = ({ plan, style }: { plan: Plan; style?: any }) => {
  const { colors } = useTheme();

  const planName = plan.name || 'Unnamed Plan';
  const planLimit = plan.limit || 0;
  const planDescription = plan.description || 'No description available';

  return (
    <View style={[styles.planChip, { backgroundColor: colors.card }, style]}>
      <Text style={[styles.planName, { color: colors.textPrimary }]}>{planName}</Text>
      <Text style={[styles.planLimit, { color: colors.accent }]}>{planLimit} visits/month</Text>
      <Text style={[styles.planDescription, { color: colors.textSecondary }]} numberOfLines={1}>
        {planDescription}
      </Text>
    </View>
  );
};

interface VenuePlansProps {
  plans?: Plan[];
}

export const VenuePlans: React.FC<VenuePlansProps> = ({ plans = [] }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const maxVisitsPerMonth = plans.length > 0 ? Math.max(...plans.map(plan => plan.limit || 0)) : 0;

  return (
    <>
      <View style={[styles.sectionContainer, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('venues.availableIn')}
        </Text>
        {plans.length > 0 ? (
          <View style={styles.plansContainer}>
            {plans.map((plan, index) => (
              <PlanChip key={`plan-${index}`} plan={plan} style={{ marginBottom: 12 }} />
            ))}
          </View>
        ) : (
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            {t('common.noResults')}
          </Text>
        )}
      </View>

      {plans.length > 0 && (
        <View
          style={[
            styles.sectionContainer,
            styles.visitLimitsContainer,
            { backgroundColor: colors.card },
          ]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('venues.maxVisitsPerMonth')}
          </Text>
          <View style={styles.visitsRow}>
            <Text style={[styles.visitsText, { color: colors.textPrimary }]}>
              0 / {maxVisitsPerMonth} {t('schedule.booked')}
            </Text>
            <View style={styles.visitsLimitBadge}>
              <Text style={styles.visitsLimitText}>{t('plans.perMonth')}</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground} />
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${(0 / maxVisitsPerMonth) * 100}%`,
                  backgroundColor: colors.accent,
                },
              ]}
            />
          </View>
          <View style={styles.progressLabelsContainer}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>0</Text>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              {maxVisitsPerMonth}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  plansContainer: {
    width: '100%',
  },
  planChip: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  planLimit: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  visitLimitsContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  visitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  visitsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  visitsLimitBadge: {
    backgroundColor: 'rgba(46, 125, 50, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visitsLimitText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 3,
  },
  progressLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
  },
});
