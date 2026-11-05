import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ZooApiService } from '../../core/zoo-api.service';

interface Message {
  from: 'bot' | 'user';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  template: `
    <section class="relative min-h-screen overflow-hidden bg-forest-950 pb-16 pt-28">
      <div class="bg-contours pointer-events-none absolute inset-0 opacity-20" aria-hidden="true"></div>
      <div class="relative mx-auto max-w-3xl px-5">
        <h1 class="text-3xl font-medium text-white sm:text-4xl">Pregunta a un guardián virtual</h1>
        <p class="mt-3 text-forest-100">Descubre qué comen, dónde viven y cómo se protegen las especies del parque.</p>

        <div class="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/80 backdrop-blur">
          <div #scroller class="h-[26rem] space-y-4 overflow-y-auto p-5" aria-live="polite">
            @for (m of messages(); track $index) {
              <div class="flex" [class.justify-end]="m.from === 'user'">
                <p class="max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed"
                   [class]="m.from === 'user' ? 'bg-electric-400 text-ink-950' : 'bg-white/10 text-forest-50'">{{ m.text }}</p>
              </div>
            }
            @if (thinking()) {
              <p class="text-sm text-forest-300">El guardián está pensando...</p>
            }
          </div>

          @if (suggestions().length) {
            <div class="flex flex-wrap gap-2 border-t border-white/10 px-5 py-3">
              @for (s of suggestions(); track s) {
                <button type="button" class="rounded-full border border-electric-400/40 px-3 py-1.5 text-sm text-electric-200 transition-colors hover:bg-electric-400/10"
                        (click)="send(s)">{{ s }}</button>
              }
            </div>
          }

          <div class="flex gap-3 border-t border-white/10 p-4">
            <label for="question" class="sr-only">Tu pregunta</label>
            <input #box id="question" type="text" maxlength="300" autocomplete="off"
                   class="flex-1 rounded-full border border-white/15 bg-ink-950 px-5 py-2.5 text-white placeholder:text-forest-300 focus:border-electric-400 focus:outline-none"
                   placeholder="Por ejemplo: ¿qué come el lince ibérico?"
                   (keydown.enter)="send(box.value); box.value = ''">
            <button type="button" class="btn btn-primary" (click)="send(box.value); box.value = ''">Preguntar</button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ChatbotComponent {
  private readonly api = inject(ZooApiService);

  @ViewChild('scroller') scroller?: ElementRef<HTMLElement>;

  messages = signal<Message[]>([
    { from: 'bot', text: '¡Hola! Soy el guardián virtual de Zoo-Logic IA. Pregúntame por un animal del parque, por ejemplo: «¿qué come el elefante asiático?».' }
  ]);
  suggestions = signal<string[]>([
    '¿Qué come el lince ibérico?',
    '¿Dónde vive el orangután de Borneo?',
    '¿Está en peligro el elefante asiático?'
  ]);
  thinking = signal(false);

  send(text: string): void {
    const question = text.trim();
    if (!question || this.thinking()) return;

    this.messages.update(list => [...list, { from: 'user', text: question }]);
    this.thinking.set(true);
    this.scrollDown();

    this.api.ask(question).subscribe({
      next: res => {
        this.messages.update(list => [...list, { from: 'bot', text: res.answer }]);
        this.suggestions.set(res.suggestions);
        this.thinking.set(false);
        this.scrollDown();
      },
      error: () => {
        this.messages.update(list => [...list, { from: 'bot', text: 'No he podido consultar la información ahora mismo. Inténtalo de nuevo en unos segundos.' }]);
        this.thinking.set(false);
        this.scrollDown();
      }
    });
  }

  private scrollDown(): void {
    setTimeout(() => {
      const el = this.scroller?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
