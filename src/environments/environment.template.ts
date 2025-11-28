/**
 * Environment Configuration Template
 * 
 * Copy this file to:
 * - environment.ts (for production)
 * - environment.development.ts (for development)
 * 
 * Then add your OpenAI API key.
 */

export const environment = {
  production: false, // Set to true for production environment
  openai: {
    // Get your API key from: https://platform.openai.com/api-keys
    apiKey: '', // Add your OpenAI API key here
    
    // Model configurations
    chatModel: 'gpt-4o-mini', // Chat model (gpt-4o-mini recommended for cost/performance)
    whisperModel: 'whisper-1', // Whisper model for speech-to-text
    
    // API endpoints
    chatUrl: 'https://api.openai.com/v1/chat/completions',
    whisperUrl: 'https://api.openai.com/v1/audio/transcriptions',
    
    // Generation parameters
    maxTokens: 300, // Maximum tokens in AI response
    temperature: 0.7 // Creativity level (0.0 to 2.0, higher = more creative)
  }
};

