import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <a routerLink="/" class="flex items-center gap-2.5" aria-label="Zoo-Logic IA, inicio">
          <svg viewBox="0 0 64 64" class="h-8 w-8" aria-hidden="true">
            <circle cx="32" cy="32" r="22" fill="none" stroke="#559a6f" stroke-width="4"/>
            <circle cx="32" cy="32" r="11" fill="none" stroke="#2fe3ff" stroke-width="4"/>
            <circle cx="32" cy="32" r="3.5" fill="#2fe3ff"/>
          </svg>
          <span class="font-display text-lg font-medium text-white">Zoo-Logic <span class="text-electric-400">IA</span></span>
        </a>

        <nav class="hidden items-center gap-1 md:flex" aria-label="Principal">
          @for (link of links; track link.path) {
            <a [routerLink]="link.path" routerLinkActive="bg-white/10 text-white"
               [routerLinkActiveOptions]="{ exact: true }"
               class="rounded-full px-4 py-2 text-sm text-forest-100 transition-colors hover:text-white">
              {{ link.label }}
            </a>
          }
        </nav>

        <button type="button" class="rounded-lg p-2 text-white md:hidden" (click)="open.set(!open())"
                [attr.aria-expanded]="open()" aria-label="Abrir menú">
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            @if (open()) { <path d="M6 6l12 12M18 6L6 18"/> } @else { <path d="M4 7h16M4 12h16M4 17h16"/> }
          </svg>
        </button>
      </div>

      @if (open()) {
        <nav class="border-t border-white/10 px-5 pb-4 md:hidden" aria-label="Móvil">
          @for (link of links; track link.path) {
            <a [routerLink]="link.path" (click)="open.set(false)"
               class="block rounded-lg px-3 py-3 text-forest-100 hover:bg-white/10 hover:text-white">{{ link.label }}</a>
          }
        </nav>
      }
    </header>
  `
})
export class NavbarComponent {
  open = signal(false);
  links = [
    { path: '/', label: 'Inicio' },
    { path: '/panel', label: 'Panel veterinario' },
    { path: '/chatbot', label: 'Chatbot educativo' }
  ];
}
