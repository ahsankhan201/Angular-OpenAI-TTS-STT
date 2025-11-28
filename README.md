# AI Speech Angular

A modern, professional Angular application for AI-powered speech recognition and conversation using OpenAI's Whisper and GPT models.

## Features

- 🎤 **Speech-to-Text**: Advanced voice recognition powered by OpenAI Whisper
- 🤖 **AI Assistant**: Intelligent conversational responses using GPT-4
- ⚡ **Real-time Processing**: Fast and accurate audio transcription
- 🎨 **Modern UI**: Clean, responsive design with Material Symbols
- 🏗️ **Professional Architecture**: Service-based architecture with proper separation of concerns

## Tech Stack

- **Angular 21** - Latest Angular framework
- **TypeScript** - Type-safe development
- **OpenAI API** - Whisper (speech-to-text) and GPT-4 (chat)
- **RxJS** - Reactive programming
- **SCSS** - Advanced styling

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AI-Speech-Angular
```

2. Install dependencies:
```bash
npm install
```

3. Configure your OpenAI API key:
   - Open `src/environments/environment.ts`
   - Add your API key:
   ```typescript
   export const environment = {
     production: false,
     openai: {
       apiKey: 'your-api-key-here', // Add your OpenAI API key
       // ... other config
     }
   };
   ```

   - For development, also update `src/environments/environment.development.ts`

   > ⚠️ **Important**: The environment files are gitignored to protect your API key. Never commit your API keys to version control.

## Running the Application

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes.

### Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Production Build

```bash
npm run build -- --configuration production
```

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   └── sidenav/        # Navigation sidebar
│   ├── models/             # TypeScript interfaces and types
│   │   ├── audio.model.ts  # Audio-related interfaces
│   │   └── chat.model.ts   # Chat message interfaces
│   ├── pages/              # Page components
│   │   ├── home/           # Landing page
│   │   └── speech-to-text/ # Speech-to-text feature page
│   ├── services/           # Business logic services
│   │   ├── audio-recording.service.ts  # Audio capture & management
│   │   ├── error-handler.service.ts    # Centralized error handling
│   │   └── openai.service.ts           # OpenAI API integration
│   └── app.ts              # Root component
├── environments/           # Environment configurations
└── styles.scss            # Global styles
```

## Architecture

The application follows Angular best practices with a clean, maintainable architecture:

### Services Layer
- **OpenAIService**: Handles all OpenAI API interactions (Whisper transcription, GPT chat)
- **AudioRecordingService**: Manages audio recording lifecycle and browser media APIs
- **ErrorHandlerService**: Provides consistent error handling and user-friendly messages

### Models Layer
- Type-safe interfaces for all data structures
- Shared types across the application
- Clear API contracts

### Component Layer
- Smart components use services for business logic
- Presentation components focus on UI
- Proper lifecycle management with RxJS

## Key Features Implementation

### Speech Recognition Flow

1. User clicks microphone button (fully accessible with ARIA labels)
2. Browser requests microphone permission
3. Audio is captured via MediaRecorder API
4. Recording stops when user clicks stop button
5. Audio blob is sent to OpenAI Whisper API
6. Transcribed text is displayed and sent to GPT-4
7. AI response is displayed in the chat
8. Chat auto-scrolls to latest message

### Code Quality Features

- ✅ **WCAG 2.1 AA Accessible** - Full keyboard navigation and screen reader support
- ✅ **Modern Angular 21** - Uses @if/@for control flow and Signals
- ✅ **Performance Optimized** - Track by for efficient list rendering
- ✅ **Auto-scroll** - Always shows latest messages
- ✅ **Semantic HTML** - Proper HTML5 elements and ARIA roles
- ✅ **Production Ready** - Professional code quality

### State Management

- RxJS Observables for reactive state updates
- BehaviorSubject for recording state
- Proper cleanup with takeUntil pattern

### Error Handling

- HTTP error interceptors with user-friendly messages
- Graceful degradation for unsupported browsers
- Clear error messages for API issues

## API Usage & Costs

This application uses OpenAI's API which requires a paid account:

- **Whisper API**: ~$0.006 per minute of audio
- **GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

## Security Notes

- ⚠️ **Never commit API keys** - Environment files are gitignored
- 🔒 API keys should be stored in environment variables or secure vaults in production
- 🌐 For production, implement a backend proxy to hide API keys from the client

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari

> Note: MediaRecorder API support required for audio recording

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check existing issues
- Create a new issue with detailed information
- Include error messages and browser console logs

## Acknowledgments

- OpenAI for Whisper and GPT APIs
- Angular team for the amazing framework
- Material Symbols for the icon set
