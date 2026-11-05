import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PanelComponent } from './pages/panel/panel.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Zoo-Logic IA | Bienestar animal con gemelos digitales' },
  { path: 'panel', component: PanelComponent, title: 'Panel veterinario | Zoo-Logic IA' },
  { path: 'chatbot', component: ChatbotComponent, title: 'Chatbot educativo | Zoo-Logic IA' },
  { path: '**', redirectTo: '' }
];
