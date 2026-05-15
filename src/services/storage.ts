import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation } from '../types';

const STORAGE_KEY = 'health_companion_conversation';

export async function saveConversation(conversation: Conversation): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  } catch (err) {
    console.warn('Failed to save conversation:', err);
  }
}

export async function loadConversation(): Promise<Conversation | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Conversation;
  } catch (err) {
    console.warn('Failed to load conversation:', err);
    return null;
  }
}

export async function clearConversation(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear conversation:', err);
  }
}
