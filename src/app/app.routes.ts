import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'speech-to-text', loadComponent: () => import('./pages/speech-to-text/speech-to-text').then(m => m.SpeechToTextPage) }
];
