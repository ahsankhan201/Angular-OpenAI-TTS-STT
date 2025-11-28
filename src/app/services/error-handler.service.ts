import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorDetails {
  message: string;
  originalError?: any;
  type: 'api' | 'recording' | 'general';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  /**
   * Processes HTTP errors from API calls
   * @param error The error object
   * @returns User-friendly error message
   */
  handleApiError(error: any): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          return 'Invalid API key. Please check your OpenAI API key configuration.';
        case 429:
          return 'Rate limit exceeded. Please try again later.';
        case 400:
          return 'Bad request. Please check your input and try again.';
        case 500:
        case 502:
        case 503:
          return 'Server error. The API service is temporarily unavailable.';
        default:
          if (error.error?.error?.message) {
            return error.error.error.message;
          }
          return `API error: ${error.statusText || 'Unknown error'}`;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Processes audio recording errors
   * @param error The error object
   * @returns User-friendly error message
   */
  handleRecordingError(error: any): string {
    if (error instanceof Error) {
      if (error.message.includes('Permission denied')) {
        return 'Microphone access denied. Please grant permission and try again.';
      }
      if (error.message.includes('not found')) {
        return 'No microphone found. Please connect a microphone and try again.';
      }
      return error.message;
    }

    return 'Failed to record audio. Please check your microphone and try again.';
  }

  /**
   * Processes general errors
   * @param error The error object
   * @returns User-friendly error message
   */
  handleGeneralError(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Logs error to console with additional context
   * @param context Description of where the error occurred
   * @param error The error object
   */
  logError(context: string, error: any): void {
    console.error(`[${context}]`, error);
    if (error instanceof HttpErrorResponse && error.error) {
      console.error('Error details:', error.error);
    }
  }

  /**
   * Creates a detailed error object
   * @param error The original error
   * @param type The type of error
   * @returns ErrorDetails object
   */
  createErrorDetails(error: any, type: 'api' | 'recording' | 'general'): ErrorDetails {
    let message: string;

    switch (type) {
      case 'api':
        message = this.handleApiError(error);
        break;
      case 'recording':
        message = this.handleRecordingError(error);
        break;
      default:
        message = this.handleGeneralError(error);
    }

    return {
      message,
      originalError: error,
      type
    };
  }
}

