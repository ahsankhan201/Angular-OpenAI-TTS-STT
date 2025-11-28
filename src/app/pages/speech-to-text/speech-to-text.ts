import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ChatMessage } from '../../models';
import { OpenAIService, AudioRecordingService, ErrorHandlerService } from '../../services';
import { APP_CONSTANTS } from '../../constants';

@Component({
  selector: 'app-speech-to-text',
  imports: [CommonModule],
  templateUrl: './speech-to-text.html',
  styleUrl: './speech-to-text.scss'
})
export class SpeechToTextPage implements OnInit, OnDestroy, AfterViewChecked {
  messages: ChatMessage[] = [];
  
  // Signals for reactive state
  isRecording = signal(false);
  isProcessing = signal(false);
  
  // ViewChild for auto-scroll
  @ViewChild('chatContainer') private chatContainer?: ElementRef<HTMLDivElement>;
  
  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;

  constructor(
    private openAIService: OpenAIService,
    private audioService: AudioRecordingService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.subscribeToRecordingState();
    this.checkApiConfiguration();
  }

  /**
   * Subscribes to audio recording state changes
   */
  private subscribeToRecordingState(): void {
    this.audioService.recordingState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        // Update signals - they automatically handle hydration
        this.isRecording.set(state.isRecording);
        this.isProcessing.set(state.isProcessing);

        if (state.error) {
          this.addMessage('assistant', `Error: ${state.error}`);
        }
      });
  }

  /**
   * Checks if OpenAI API is properly configured
   */
  private checkApiConfiguration(): void {
    if (!this.openAIService.isConfigured()) {
      console.warn(APP_CONSTANTS.ERROR_MESSAGES.API_KEY_MISSING);
    }
  }

  /**
   * Toggles audio recording on/off
   */
  async toggleRecording(): Promise<void> {
    // Allow starting new recording even if previous is processing
    // Only block if currently recording AND processing (shouldn't happen)
    if (this.isRecording() && this.isProcessing()) {
      return;
    }

    try {
      if (this.isRecording()) {
        await this.stopRecording();
      } else {
        await this.startRecording();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  }

  /**
   * Starts audio recording
   */
  private async startRecording(): Promise<void> {
    try {
      await this.audioService.startRecording();
    } catch (error) {
      this.errorHandler.logError('Start Recording', error);
      const errorMessage = this.errorHandler.handleRecordingError(error);
      this.addMessage('assistant', `Error: ${errorMessage}`);
    }
  }

  /**
   * Stops audio recording and processes the audio
   */
  private async stopRecording(): Promise<void> {
    try {
      const audioBlob = await this.audioService.stopRecording();
      await this.processAudio(audioBlob);
    } catch (error) {
      this.errorHandler.logError('Stop Recording', error);
      const errorMessage = this.errorHandler.handleRecordingError(error);
      this.addMessage('assistant', `Error: ${errorMessage}`);
    }
  }

  /**
   * Processes recorded audio: transcribes and sends to AI
   * @param audioBlob The recorded audio blob
   */
  private async processAudio(audioBlob: Blob): Promise<void> {
    this.audioService.setProcessing(true);

    try {
      // Transcribe audio
      const transcript = await this.openAIService.transcribeAudio(audioBlob);

      if (!transcript) {
        throw new Error('No transcript received');
      }

      // Add user message
      this.addMessage('user', transcript);

      // Get AI response
      await this.getAIResponse();
    } catch (error) {
      this.errorHandler.logError('Process Audio', error);
      const errorMessage = this.errorHandler.handleApiError(error);
      this.addMessage('assistant', `Error: ${errorMessage}`);
    } finally {
      this.audioService.setProcessing(false);
    }
  }

  /**
   * Gets AI response for the conversation
   */
  private async getAIResponse(): Promise<void> {
    // Add thinking indicator
    this.addMessage('assistant', APP_CONSTANTS.THINKING_MESSAGE);

    try {
      // Filter out thinking messages before sending to API
      const conversationMessages = this.messages.filter(
        (msg) => msg.content !== APP_CONSTANTS.THINKING_MESSAGE
      );

      const response = await this.openAIService.sendChatMessage(conversationMessages);

      // Remove thinking indicator
      this.removeThinkingMessage();

      // Add AI response
      this.addMessage('assistant', response);
    } catch (error) {
      this.errorHandler.logError('Get AI Response', error);
      this.removeThinkingMessage();

      const errorMessage = this.errorHandler.handleApiError(error);
      this.addMessage('assistant', `Error: ${errorMessage}`);
    }
  }

  /**
   * Adds a message to the chat
   * @param role The role of the message sender
   * @param content The message content
   */
  private addMessage(role: 'user' | 'assistant', content: string): void {
    const newMessage: ChatMessage = {
      role,
      content,
      timestamp: new Date()
    };
    this.messages = [...this.messages, newMessage];
    this.shouldScrollToBottom = true; // Trigger auto-scroll
  }

  /**
   * Removes thinking indicator messages from chat
   */
  private removeThinkingMessage(): void {
    this.messages = this.messages.filter((msg) => msg.content !== APP_CONSTANTS.THINKING_MESSAGE);
  }

  /**
   * Clears all chat messages
   */
  clearChat(): void {
    this.messages = [];
  }

  /**
   * Auto-scrolls chat container to bottom after view update
   */
  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  /**
   * Scrolls the chat container to the bottom
   */
  private scrollToBottom(): void {
    if (this.chatContainer) {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (error) {
        // Silently fail if scrolling is not possible
      }
    }
  }

  /**
   * Track by function for message list optimization
   * @param index Item index
   * @param message Chat message
   * @returns Unique identifier for the message
   */
  trackByTimestamp(index: number, message: ChatMessage): number {
    return message.timestamp.getTime();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
