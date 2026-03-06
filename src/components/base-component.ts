/**
 * Clase base para Web Components Prodaric.
 * Añade atributo de tema y clase común.
 */

export const PRODARIC_BASE_CLASS = 'prodaric-wc';

export abstract class ProdaricBaseComponent extends HTMLElement {
  static readonly tagName: string;

  constructor() {
    super();
    this.classList.add(PRODARIC_BASE_CLASS);
  }

  /** Aplica el tema (dark/light) según data-prodaric-theme en un ancestro o en documentElement. */
  protected getTheme(): 'light' | 'dark' {
    const root = document.documentElement;
    const theme = root.getAttribute('data-prodaric-theme') ?? root.getAttribute('data-theme') ?? '';
    if (theme === 'dark') return 'dark';
    let el: Element | null = this;
    while (el) {
      if (el.getAttribute('data-prodaric-theme') === 'dark' || el.classList.contains('prodaric-theme-dark')) {
        return 'dark';
      }
      el = el.parentElement;
    }
    return 'light';
  }
}
