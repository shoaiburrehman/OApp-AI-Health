import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../utils/theme';

const SUGGESTIONS = [
  "I've had a headache since this morning",
  "My throat has been sore for two days",
  "I feel more tired than usual lately",
];

interface Props {
  onSuggestion: (text: string) => void;
}

export function EmptyState({ onSuggestion }: Props) {
  const { TouchableOpacity } = require('react-native');

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✦</Text>
      <Text style={styles.heading}>How are you feeling?</Text>
      <Text style={styles.body}>
        Describe your symptoms or ask a health question. I'm here to help you understand what's
        going on and decide if you should see a doctor.
      </Text>
      <Text style={styles.suggestionsLabel}>Try saying</Text>
      {SUGGESTIONS.map((s) => (
        <TouchableOpacity key={s} style={styles.suggestionChip} onPress={() => onSuggestion(s)}>
          <Text style={styles.suggestionText}>"{s}"</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.disclaimer}>
        Not a replacement for professional medical advice.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  icon: {
    fontSize: 36,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  heading: {
    fontSize: typography.fontSizeXL,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    fontSize: typography.fontSizeMD,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  suggestionsLabel: {
    fontSize: typography.fontSizeXS,
    fontWeight: typography.fontWeightSemibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  suggestionChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  suggestionText: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  disclaimer: {
    fontSize: typography.fontSizeXS,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
