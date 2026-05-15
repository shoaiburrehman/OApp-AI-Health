# AI Health Companion

A mobile chat app where users can have a conversation with a calm, thoughtful AI health companion. Built with Expo + React Native (TypeScript) as part of a take-home case study.

---

## Stack

- **Expo SDK 54** + **React Native 0.81.5**
- **TypeScript** throughout
- **Expo Router** for navigation
- **AsyncStorage** for persistence
- **react-native-dotenv** for environment config

---

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo-url>
cd ai-health-companion
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
API_TOKEN=your_key_here
API_BASE_URL=https://api.groq.com/openai/v1
MODEL_NAME=llama-3.3-70b-versatile
```

### 3. Run

```bash
npx expo start --clear
```

Scan the QR code with **Expo Go** (iOS/Android). Make sure your phone and computer are on the same Wi-Fi.

---

## Getting an API Key

### Groq (recommended - free, fast)
1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Sign up and click **Create API Key**
3. Paste into `.env` as `API_TOKEN`

### OpenAI
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Set `API_BASE_URL=https://api.openai.com/v1` and `MODEL_NAME=gpt-4o-mini`

### Local (Ollama)
```env
API_TOKEN=ollama
API_BASE_URL=http://localhost:11434/v1
MODEL_NAME=llama3
```

---

## Requirements Coverage

| Requirement | Implementation |
|---|---|
| Streaming UI | Words appear progressively with animated thinking dots |
| Multi-turn conversation | Full message history sent on every request |
| Persistence | AsyncStorage - survives app restart |
| System prompt | `src/services/systemPrompt.ts` - isolated, documented, easy to evolve |
| Structured interaction | Symptom Reporter: severity (1–5) + duration chips injected as structured message |
| Empty state | Welcome screen with suggested prompts |
| Loading state | Guarded render until AsyncStorage resolves |
| Streaming state | Animated bouncing dots → progressive word reveal |
| Error state | Inline dismissible banner with error message |
| Offline state | NetInfo check before every send, offline banner shown |

---

## Architecture

### LLM Client (`src/services/llmClient.ts`)
Single exported function: `streamChatCompletion`. Takes messages and callbacks, handles the HTTP call, simulates word-by-word streaming. The screen knows nothing about HTTP - only that it receives tokens.

To swap providers: change `.env` only. No code changes needed.

### System Prompt (`src/services/systemPrompt.ts`)
Persona lives in its own file, not inline in the API call. This makes it versionable, diffable, and straightforward to A/B test or load remotely. The file includes comments explaining how to evolve it.

### State Management (`src/hooks/useChat.ts`)
Plain `useState` in a custom hook. No Redux or Zustand. The app has one screen and one piece of shared state - adding a state library would have been over-engineering. `streamingContent` is kept as a separate string during streaming and only committed to the message list on completion, so the history list doesn't re-render mid-stream.

### Persistence (`src/services/storage.ts`)
Thin AsyncStorage wrapper. Decoupled from the hook so it can be swapped to SQLite or MMKV without touching `useChat`.

### Structured Interaction: Symptom Reporter
Tap `＋` to open a bottom sheet collecting symptom name, severity (1–5 with colour coding), and duration. On submit, formats a structured natural-language message injected into chat. Chosen because severity and time-course are the two signals users most forget to mention in free text - collecting them up front gives the AI better context without any special parsing.

---

## What I cut and why

- **Onboarding / auth** - explicitly out of scope
- **Markdown rendering** - the health companion persona produces conversational prose, not technical docs; a renderer would add a dependency for little gain
- **Multiple conversations** - one persisted conversation is the right scope for this slice; history management would add UI complexity without demonstrating anything new
- **Message timestamps in UI** - stored in the data model but not shown; would clutter the calm aesthetic. Could expose on long-press.

---

## Project Structure

```
app/
  _layout.tsx             # Expo Router root
  index.tsx               # Entry → ChatScreen

src/
  components/
    ChatScreen.tsx         # Main screen, composes everything
    ChatInput.tsx          # Text input + symptom trigger button
    MessageBubble.tsx      # User / assistant message
    StreamingBubble.tsx    # Animated dots → streaming text
    SymptomReporter.tsx    # Structured symptom bottom sheet
    EmptyState.tsx         # Zero messages view with suggestions
    StatusBanner.tsx       # Error / offline alert

  hooks/
    useChat.ts             # All chat state, streaming, persistence

  services/
    llmClient.ts           # OpenAI-compatible HTTP client
    systemPrompt.ts        # Persona definition
    storage.ts             # AsyncStorage read/write

  types/
    index.ts               # Message, Conversation, StreamStatus

  utils/
    theme.ts               # Colors, typography, spacing tokens
```