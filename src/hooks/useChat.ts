import { useState, useEffect, useRef, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Message, Conversation, StreamStatus } from '../types';
import { streamChatCompletion } from '../services/llmClient';
import { saveConversation, loadConversation, clearConversation } from '../services/storage';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function newConversation(): Conversation {
  return {
    id: generateId(),
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function useChat() {
  const [conversation, setConversation] = useState<Conversation>(newConversation());
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [streamingContent, setStreamingContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadConversation().then((saved) => {
      if (saved && saved.messages.length > 0) {
        setConversation(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveConversation(conversation);
  }, [conversation, isLoaded]);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || status === 'streaming') return;

      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        setStatus('offline');
        setErrorMessage('No internet connection. Please check your network and try again.');
        return;
      }

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: userText.trim(),
        timestamp: Date.now(),
      };

      const updatedMessages = [...conversation.messages, userMessage];

      setConversation((prev) => ({
        ...prev,
        messages: updatedMessages,
        updatedAt: Date.now(),
      }));

      setStatus('streaming');
      setStreamingContent('');
      setErrorMessage(null);

      abortControllerRef.current = new AbortController();
      let accumulated = '';

      await streamChatCompletion(
        updatedMessages,
        (token) => {
          accumulated += token;
          setStreamingContent(accumulated);
        },
        () => {
          const assistantMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: accumulated,
            timestamp: Date.now(),
          };

          setConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, assistantMessage],
            updatedAt: Date.now(),
          }));

          setStreamingContent('');
          setStatus('idle');
        },
        (err) => {
          setStatus('error');
          setErrorMessage(err.message);
          setStreamingContent('');
        },
        abortControllerRef.current.signal,
      );
    },
    [conversation, status],
  );

  const clearChat = useCallback(async () => {
    abortControllerRef.current?.abort();
    await clearConversation();
    setConversation(newConversation());
    setStatus('idle');
    setStreamingContent('');
    setErrorMessage(null);
  }, []);

  const dismissError = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  return {
    messages: conversation.messages,
    streamingContent,
    status,
    errorMessage,
    isLoaded,
    sendMessage,
    clearChat,
    dismissError,
  };
}