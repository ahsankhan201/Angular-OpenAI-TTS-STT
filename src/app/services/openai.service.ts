import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  TranscriptionResponse,
  ChatMessagePayload
} from '../models';
import { APP_CONSTANTS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private readonly apiKey = environment.openai.apiKey;
  private readonly chatUrl = environment.openai.chatUrl;
  private readonly whisperUrl = environment.openai.whisperUrl;
  private readonly chatModel = environment.openai.chatModel;
  private readonly whisperModel = environment.openai.whisperModel;
  private readonly maxTokens = environment.openai.maxTokens;
  private readonly temperature = environment.openai.temperature;

  constructor(private http: HttpClient) {}

  /**
   * Transcribes audio using OpenAI Whisper API
   * @param audioBlob The audio blob to transcribe
   * @returns Promise with transcription text
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    const audioFile = new File([audioBlob], APP_CONSTANTS.AUDIO.FILE_NAME, {
      type: APP_CONSTANTS.AUDIO.DEFAULT_MIME_TYPE
    });
    formData.append('file', audioFile);
    formData.append('model', this.whisperModel);

    const headers = this.createAuthHeaders(false);

    const response = await firstValueFrom(
      this.http.post<TranscriptionResponse>(this.whisperUrl, formData, { headers })
    );

    return response.text.trim();
  }

  /**
   * Sends a chat message to OpenAI and gets a response
   * @param messages Array of chat messages
   * @param systemPrompt Optional system prompt
   * @returns Promise with AI response
   */
  async sendChatMessage(
    messages: ChatMessage[],
    systemPrompt: string = APP_CONSTANTS.DEFAULT_SYSTEM_PROMPT
  ): Promise<string> {
    const chatMessages: ChatMessagePayload[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const requestBody: ChatRequest = {
      model: this.chatModel,
      messages: chatMessages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      stream: false
    };

    const headers = this.createAuthHeaders(true);

    const response = await firstValueFrom(
      this.http.post<ChatResponse>(this.chatUrl, requestBody, { headers })
    );

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    }

    throw new Error('No response from AI');
  }

  /**
   * Checks if the API key is configured
   * @returns boolean indicating if API key is set
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.trim().length > 0;
  }

  /**
   * Creates HTTP headers for OpenAI API requests
   * @param includeContentType Whether to include Content-Type header
   * @returns HttpHeaders object
   */
  private createAuthHeaders(includeContentType: boolean): HttpHeaders {
    const headersConfig: { [key: string]: string } = {
      Authorization: `Bearer ${this.apiKey}`
    };

    if (includeContentType) {
      headersConfig['Content-Type'] = 'application/json';
    }

    return new HttpHeaders(headersConfig);
  }
}

