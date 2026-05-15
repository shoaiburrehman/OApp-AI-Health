import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StreamStatus } from '../types';
import { colors, typography, spacing, radius } from '../utils/theme';

interface Props {
  status: StreamStatus;
  message: string | null;
  onDismiss: () => void;
}

export function StatusBanner({ status, message, onDismiss }: Props) {
  if (status !== 'error' && status !== 'offline') return null;

  const isOffline = status === 'offline';

  return (
    <View style={[styles.banner, isOffline ? styles.bannerOffline : styles.bannerError]}>
      <Text style={styles.icon}>{isOffline ? '📡' : '⚠️'}</Text>
      <Text style={styles.message} numberOfLines={2}>
        {message ?? (isOffline ? 'No internet connection.' : 'Something went wrong.')}
      </Text>
      <TouchableOpacity onPress={onDismiss} style={styles.dismiss}>
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  bannerError: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.error,
  },
  bannerOffline: {
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  icon: {
    fontSize: 16,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSizeSM,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  dismiss: {
    padding: spacing.xs,
  },
  dismissText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightBold,
  },
});
