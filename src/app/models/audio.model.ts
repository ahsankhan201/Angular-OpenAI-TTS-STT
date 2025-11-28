export interface AudioRecordingConfig {
  mimeType: string;
  audioBitsPerSecond?: number;
}

export interface TranscriptionResponse {
  text: string;
}

export interface AudioRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

