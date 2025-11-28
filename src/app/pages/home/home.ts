import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ROUTES } from '../../constants';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomePage {
  constructor(private router: Router) {}

  /**
   * Navigates to the speech-to-text page
   */
  navigateToSpeechToText(): void {
    this.router.navigate([ROUTES.SPEECH_TO_TEXT]);
  }

  /**
   * Opens documentation (placeholder for future implementation)
   */
  openDocumentation(): void {
    // TODO: Implement documentation page or external link
    console.log('Documentation feature coming soon');
  }
}
