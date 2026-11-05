import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-white/10 bg-ink-950 py-10">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm text-forest-200 md:flex-row md:items-center md:justify-between">
        <p>Zoo-Logic IA. Proyecto académico de gestión y bienestar animal con inteligencia artificial.</p>
        <nav class="flex gap-5" aria-label="Pie de página">
          <a routerLink="/panel" class="hover:text-white">Panel veterinario</a>
          <a routerLink="/chatbot" class="hover:text-white">Chatbot educativo</a>
          <a href="/swagger" class="hover:text-white">API</a>
        </nav>
      </div>
    </footer>
  `
})
export class FooterComponent {}
