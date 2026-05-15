import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Keyboard,
} from 'react-native';
import { colors, typography, spacing, radius } from '../utils/theme';

interface Props {
  onSend: (text: string) => void;
  onSymptomPress: () => void;
  isStreaming: boolean;
}

export function ChatInput({ onSend, onSymptomPress, isStreaming }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setText('');
    Keyboard.dismiss();
  };

  const canSend = text.trim().length > 0 && !isStreaming;

  return (
    <View style={styles.container}>
      {/* Symptom reporter trigger */}
      <TouchableOpacity
        style={styles.symptomBtn}
        onPress={onSymptomPress}
        disabled={isStreaming}
        accessibilityLabel="Report a symptom"
      >
        <Text style={styles.symptomIcon}>＋</Text>
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Describe how you're feeling…"
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={1000}
        returnKeyType="default"
        editable={!isStreaming}
      />

      <TouchableOpacity
        style={[styles.sendBtn, canSend && styles.sendBtnActive]}
        onPress={handleSend}
        disabled={!canSend}
        accessibilityLabel="Send message"
      >
        <Text style={[styles.sendIcon, canSend && styles.sendIconActive]}>↑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  symptomBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
    flexShrink: 0,
  },
  symptomIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
    lineHeight: 22,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    fontSize: typography.fontSizeMD,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceAlt,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
    flexShrink: 0,
  },
  sendBtnActive: {
    backgroundColor: colors.primary,
  },
  sendIcon: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: typography.fontWeightBold,
  },
  sendIconActive: {
    color: colors.textOnPrimary,
  },
});
