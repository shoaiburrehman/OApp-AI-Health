/**
 * SymptomReporter - the "one structured interaction beyond free chat"
 *
 * A small bottom sheet that lets users report a symptom with a severity
 * slider and duration chips. On submit, it builds a structured message
 * that gets injected into the chat as if the user typed it.
 *
 * Product thinking: Severity + duration are the two most clinically useful
 * triage signals. Collecting them in a structured way means the AI always
 * has them - even if the user wouldn't think to mention them in free text.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { colors, typography, spacing, radius } from '../utils/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

const DURATIONS = ['Just started', 'A few hours', '1–2 days', 'Several days', 'Over a week'];

const SEVERITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Very mild', color: colors.severity1 },
  2: { label: 'Mild', color: colors.severity2 },
  3: { label: 'Moderate', color: colors.severity3 },
  4: { label: 'Severe', color: colors.severity4 },
  5: { label: 'Very severe', color: colors.severity5 },
};

export function SymptomReporter({ visible, onClose, onSubmit }: Props) {
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState(3);
  const [duration, setDuration] = useState('');

  const handleSubmit = () => {
    if (!symptom.trim()) return;

    const durationText = duration || 'unknown duration';
    const severityInfo = SEVERITY_LABELS[severity];

    // Structured message injected into chat
    const message = `I'm experiencing: ${symptom.trim()}
Severity: ${severity}/5 (${severityInfo.label})
Duration: ${durationText}

Can you help me understand what might be going on?`;

    onSubmit(message);
    // Reset
    setSymptom('');
    setSeverity(3);
    setDuration('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>Describe your symptom</Text>
          <Text style={styles.subtitle}>
            We'll send this as a structured message to get the most helpful response.
          </Text>

          {/* Symptom input */}
          <Text style={styles.label}>What are you experiencing?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. headache, sore throat, stomach pain..."
            placeholderTextColor={colors.textMuted}
            value={symptom}
            onChangeText={setSymptom}
            maxLength={120}
            autoFocus
          />

          {/* Severity */}
          <Text style={styles.label}>Severity</Text>
          <View style={styles.severityRow}>
            {[1, 2, 3, 4, 5].map((val) => {
              const info = SEVERITY_LABELS[val];
              const selected = severity === val;
              return (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.severityBtn,
                    selected && { backgroundColor: info.color, borderColor: info.color },
                  ]}
                  onPress={() => setSeverity(val)}
                >
                  <Text style={[styles.severityNum, selected && styles.severityNumSelected]}>
                    {val}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={[styles.severityLabel, { color: SEVERITY_LABELS[severity].color }]}>
            {SEVERITY_LABELS[severity].label}
          </Text>

          {/* Duration chips */}
          <Text style={styles.label}>How long?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, duration === d && styles.chipSelected]}
                onPress={() => setDuration(d === duration ? '' : d)}
              >
                <Text style={[styles.chipText, duration === d && styles.chipTextSelected]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, !symptom.trim() && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!symptom.trim()}
            >
              <Text style={styles.submitText}>Send to companion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,35,50,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    paddingTop: spacing.lg,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSizeXL,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  label: {
    fontSize: typography.fontSizeSM,
    fontWeight: typography.fontWeightSemibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.fontSizeMD,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceAlt,
    marginBottom: spacing.xl,
  },
  severityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  severityBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  severityNum: {
    fontSize: typography.fontSizeLG,
    fontWeight: typography.fontWeightSemibold,
    color: colors.textSecondary,
  },
  severityNumSelected: {
    color: colors.textOnPrimary,
  },
  severityLabel: {
    fontSize: typography.fontSizeSM,
    fontWeight: typography.fontWeightMedium,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  chips: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceAlt,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeightSemibold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: typography.fontSizeMD,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitText: {
    fontSize: typography.fontSizeMD,
    color: colors.textOnPrimary,
    fontWeight: typography.fontWeightSemibold,
  },
});
