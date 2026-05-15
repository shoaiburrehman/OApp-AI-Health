import { Message, MessageRole } from '../types';
import { SYSTEM_PROMPT } from './systemPrompt';

// @ts-ignore
import { API_TOKEN, API_BASE_URL, MODEL_NAME } from '@env';

interface OpenAIMessage {
  role: MessageRole;
  content: string;
}

export async function streamChatCompletion(
  messages: Message[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (!API_TOKEN || API_TOKEN === 'your_api_key_here') {
    onError(new Error('API key not configured. Check your .env file.'));
    return;
  }

  const payload: OpenAIMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: payload,
        stream: false,
        temperature: 0.7,
        max_tokens: 1024,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    // Simulate streaming word by word for the typing feel
    const words = content.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) return;
      const chunk = i === 0 ? words[i] : ' ' + words[i];
      onToken(chunk);
      await new Promise((r) => setTimeout(r, 18));
    }

    onDone();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    onError(err instanceof Error ? err : new Error('Unknown error'));
  }
}