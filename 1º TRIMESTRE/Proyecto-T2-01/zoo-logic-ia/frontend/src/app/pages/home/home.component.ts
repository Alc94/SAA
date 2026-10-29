import { AfterViewInit, Component, HostListener, OnDestroy, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private observer?: IntersectionObserver;

  readonly sections = [
    { id: 'inicio', label: 'Presentación' },
    { id: 'problema', label: 'El problema' },
    { id: 'funcionamiento', label: 'Cómo funciona' },
    { id: 'publicos', label: 'Dos públicos' },
    { id: 'metodologia', label: 'Metodología' },
    { id: 'impacto', label: 'Impacto' }
  ];


  readonly flow = [
    { title: 'Captura', text: 'Cámaras, sensores y personal registran datos las 24 horas.' },
    { title: 'Gemelo digital', text: 'Todo se unifica en el perfil vivo de cada animal.' },
    { title: 'Detección', text: 'El modelo compara con lo normal y puntúa la anomalía.' },
    { title: 'Aviso', text: 'El veterinario recibe la alerta con el contexto necesario.' }
  ];

  readonly method = [
    { title: 'Aprendizaje supervisado', text: 'El modelo aprende de casos reales etiquetados por veterinarios: qué es una marcha normal, una cojera o una pérdida de apetito.' },
    { title: 'Datos sintéticos', text: 'Las enfermedades raras tienen pocos ejemplos. Generamos casos simulados para entrenar al modelo sin esperar a que ocurran.' },
    { title: 'Validación experta continua', text: 'Cada alerta pasa por una persona que la confirma o la descarta. Esa decisión se guarda y mejora al modelo.' }
  ];

  readonly active = signal('inicio');
  readonly progress = signal(0);

  ngAfterViewInit(): void {
    // Marca como activa la sección que cruza la franja central de la pantalla.
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.active.set(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    this.doc.querySelectorAll('[data-section]').forEach(el => this.observer?.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const el = this.doc.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    this.progress.set(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
  }

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
