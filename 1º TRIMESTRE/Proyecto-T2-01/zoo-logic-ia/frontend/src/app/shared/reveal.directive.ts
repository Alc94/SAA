import { Directive, ElementRef, Input, OnDestroy, OnInit, inject, numberAttribute } from '@angular/core';

/**
 * Anima un elemento cuando entra en el viewport (Intersection Observer).
 * Uso: <div appReveal>, <div appReveal="left" revealDelay="150">
 * Variantes: "" (sube), "left", "right", "scale", "line".
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  @Input() appReveal = '';
  @Input({ transform: numberAttribute }) revealDelay = 0;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const el = this.host.nativeElement;
    el.classList.add('reveal');
    if (this.appReveal) el.classList.add(`reveal-${this.appReveal}`);
    if (this.revealDelay) el.style.transitionDelay = `${this.revealDelay}ms`;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            this.observer?.unobserve(el);
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
