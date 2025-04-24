import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '@/design-system';

type Plan = {
  name?: string;
  limit?: number;
};

const PlanChip = ({plan, style}: {plan: Plan; style?: any}) => {
  const {colors} = useTheme();
  return (
    <View
      style={[
        styles.planChip,
        {backgroundColor: colors.card},
        style,
      ]}>
      <Text style={{color: colors.textPrimary}}>{plan.name || 'Plan'}</Text>
    </View>
  );
};

interface VenuePlansProps {
  plans?: Plan[];
}

export const VenuePlans: React.FC<VenuePlansProps> = ({plans = []}) => {
  const {colors} = useTheme();
  
  const maxVisitsPerMonth =
    plans.length > 0
      ? Math.max(...plans.map((plan) => plan.limit || 0))
      : 0;

  return (
    <>
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
          {'venues.availableIn'}
        </Text>
        {plans.length > 0 ? (
          <View style={styles.plansContainer}>
            {plans.map((plan, index) => (
              <PlanChip
                key={`plan-${index}`}
                plan={plan}
                style={{marginBottom: 12}}
              />
            ))}
          </View>
        ) : (
          <Text style={[styles.sectionText, {color: colors.textSecondary}]}>
            {'common.noResults'}
          </Text>
        )}
      </View>

      {plans.length > 0 && (
        <View
          style={[
            styles.sectionContainer,
            styles.visitLimitsContainer,
            {backgroundColor: colors.card},
          ]}>
          <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
            {'venues.maxVisitsPerMonth'}
          </Text>
          <View style={styles.visitsRow}>
            <Text style={[styles.visitsText, {color: colors.textPrimary}]}>
              0 / {maxVisitsPerMonth} {'schedule.booked'}
            </Text>
            <View style={styles.visitsLimitBadge}>
              <Text style={styles.visitsLimitText}>{'plans.perMonth'}</Text>
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
            <Text
              style={[styles.progressLabel, {color: colors.textSecondary}]}>
              0
            </Text>
            <Text
              style={[styles.progressLabel, {color: colors.textSecondary}]}>
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
  visitLimitsContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
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
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
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