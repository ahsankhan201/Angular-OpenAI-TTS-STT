/**
 * Application-wide constants
 */

export const APP_CONSTANTS = {
  APP_NAME: 'AI Speech Angular',
  APP_VERSION: '1.0.0',
  
  // Chat messages
  THINKING_MESSAGE: '💭 Thinking...',
  
  // System prompts
  DEFAULT_SYSTEM_PROMPT:
    'You are a helpful AI assistant. Provide clear, concise, and accurate responses.',
  
  // Error messages
  ERROR_MESSAGES: {
    NO_MICROPHONE: 'Could not access microphone. Please grant permission and try again.',
    API_KEY_MISSING: 'OpenAI API key is not configured. Please add it to the environment file.',
    RECORDING_IN_PROGRESS: 'Recording is already in progress.',
    NO_RECORDING: 'No recording in progress.',
    TRANSCRIPTION_FAILED: 'Failed to transcribe audio.',
    AI_RESPONSE_FAILED: 'Failed to get response from AI.',
    UNSUPPORTED_BROWSER:
      'Audio recording is not supported in this browser. Please use Chrome, Firefox, or Edge.'
  },
  
  // Audio configuration
  AUDIO: {
    DEFAULT_MIME_TYPE: 'audio/webm',
    FILE_NAME: 'recording.webm'
  }
} as const;

/**
 * Navigation routes
 */
export const ROUTES = {
  HOME: '/',
  SPEECH_TO_TEXT: '/speech-to-text'
} as const;

