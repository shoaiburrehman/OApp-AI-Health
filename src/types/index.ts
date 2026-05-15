export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type StreamStatus = 'idle' | 'streaming' | 'error' | 'offline';

export interface ChatState {
  conversation: Conversation;
  status: StreamStatus;
  errorMessage: string | null;
}

// For the symptom severity structured interaction
export interface SymptomReport {
  symptom: string;
  severity: 1 | 2 | 3 | 4 | 5;
  duration: string;
}
