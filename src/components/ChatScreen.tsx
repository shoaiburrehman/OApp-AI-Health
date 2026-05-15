import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { StreamingBubble } from './StreamingBubble';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { StatusBanner } from './StatusBanner';
import { SymptomReporter } from './SymptomReporter';
import { colors, typography, spacing } from '../utils/theme';
import { Message } from '../types';

export function ChatScreen() {
  const { messages, streamingContent, status, errorMessage, isLoaded, sendMessage, clearChat, dismissError } =
    useChat();
  const [symptomModalVisible, setSymptomModalVisible] = useState(false);
  const listRef = useRef<FlatList>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if ((messages.length > 0 || status === 'streaming') && listRef.current) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, streamingContent, status]);

  const handleClearChat = () => {
    Alert.alert('Clear conversation', 'This will delete the entire conversation history.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearChat },
    ]);
  };

  const isEmpty = messages.length === 0 && status !== 'streaming';

  // Build list data: existing messages + streaming placeholder
  type ListItem = Message | { id: '__streaming__'; streaming: true };
  const listData: ListItem[] = [
    ...messages,
    ...(status === 'streaming' ? [{ id: '__streaming__' as const, streaming: true as const }] : []),
  ];

  const renderItem = ({ item }: { item: ListItem }) => {
    if ('streaming' in item) {
      return <StreamingBubble content={streamingContent} />;
    }
    return <MessageBubble message={item} />;
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerDot} />
          <Text style={styles.headerTitle}>Health Companion</Text>
        </View>
        {messages.length > 0 && (
          <TouchableOpacity onPress={handleClearChat} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Error / offline banner */}
        <StatusBanner status={status} message={errorMessage} onDismiss={dismissError} />

        {/* Message list or empty state */}
        {isEmpty ? (
          <EmptyState onSuggestion={sendMessage} />
        ) : (
          <FlatList
            ref={listRef}
            data={listData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onSymptomPress={() => setSymptomModalVisible(true)}
          isStreaming={status === 'streaming'}
        />
      </KeyboardAvoidingView>

      {/* Symptom reporter modal */}
      <SymptomReporter
        visible={symptomModalVisible}
        onClose={() => setSymptomModalVisible(false)}
        onSubmit={sendMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: typography.fontSizeLG,
    fontWeight: typography.fontWeightSemibold,
    color: colors.textPrimary,
  },
  clearBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  clearText: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  listContent: {
    paddingVertical: spacing.lg,
    flexGrow: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.fontSizeMD,
    color: colors.textMuted,
  },
});
