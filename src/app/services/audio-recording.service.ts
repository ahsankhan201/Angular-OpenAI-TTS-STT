import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { AudioRecordingState } from '../models';
import { APP_CONSTANTS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;
  private isCurrentlyRecording = false; // Internal flag to prevent race conditions

  private recordingStateSubject = new BehaviorSubject<AudioRecordingState>({
    isRecording: false,
    isProcessing: false,
    error: null
  });

  public recordingState$: Observable<AudioRecordingState> =
    this.recordingStateSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Gets the current recording state
   */
  get currentState(): AudioRecordingState {
    return this.recordingStateSubject.value;
  }

  /**
   * Checks if audio recording is supported in the current environment
   * @returns boolean indicating support
   */
  isSupported(): boolean {
    return (
      isPlatformBrowser(this.platformId) &&
      navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia
    );
  }

  /**
   * Starts audio recording
   * @returns Promise that resolves when recording starts
   * @throws Error if recording is not supported or permission denied
   */
  async startRecording(): Promise<void> {
    if (!this.isSupported()) {
      throw new Error(APP_CONSTANTS.ERROR_MESSAGES.UNSUPPORTED_BROWSER);
    }

    // Check internal flag to prevent race conditions
    if (this.isCurrentlyRecording || this.currentState.isRecording) {
      throw new Error(APP_CONSTANTS.ERROR_MESSAGES.RECORDING_IN_PROGRESS);
    }

    // Set flag immediately to prevent double-calls
    this.isCurrentlyRecording = true;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(this.mediaStream);

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.updateState({ isRecording: true, error: null });
    } catch (error) {
      this.isCurrentlyRecording = false; // Reset flag on error
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to access microphone';
      this.updateState({ error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  /**
   * Stops audio recording
   * @returns Promise that resolves with the recorded audio blob
   * @throws Error if no recording is in progress
   */
  async stopRecording(): Promise<Blob> {
    // Check internal flag first
    if (!this.mediaRecorder || !this.isCurrentlyRecording) {
      throw new Error(APP_CONSTANTS.ERROR_MESSAGES.NO_RECORDING);
    }

    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error(APP_CONSTANTS.ERROR_MESSAGES.NO_RECORDING));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: APP_CONSTANTS.AUDIO.DEFAULT_MIME_TYPE
        });
        this.isCurrentlyRecording = false; // Reset internal flag
        this.cleanup();
        this.updateState({ isRecording: false });
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (event: Event) => {
        this.isCurrentlyRecording = false; // Reset internal flag
        this.cleanup();
        this.updateState({ isRecording: false, error: 'Recording error occurred' });
        reject(new Error('Recording error occurred'));
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Sets the processing state
   * @param isProcessing Whether audio is being processed
   */
  setProcessing(isProcessing: boolean): void {
    this.updateState({ isProcessing });
  }

  /**
   * Cleans up media resources
   */
  private cleanup(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isCurrentlyRecording = false; // Always reset flag on cleanup
  }

  /**
   * Updates the recording state
   * @param partialState Partial state to update
   */
  private updateState(partialState: Partial<AudioRecordingState>): void {
    const newState = {
      ...this.currentState,
      ...partialState
    };
    
    // Signals in the component will handle reactivity automatically
    this.recordingStateSubject.next(newState);
  }

  /**
   * Cleans up resources when service is destroyed
   */
  ngOnDestroy(): void {
    this.cleanup();
  }
}

