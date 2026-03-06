/**
 * Botón Web Component Prodaric.
 * Uso: <prodaric-button>Etiqueta</prodaric-button> o <prodaric-button type="submit">Enviar</prodaric-button>
 */

import { ProdaricBaseComponent } from './base-component';

export class ProdaricButton extends ProdaricBaseComponent {
  static readonly tagName = 'prodaric-button';

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: inline-block; }
        button {
          font-family: inherit;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid var(--prodaric-border, #e2e8f0);
          background: var(--prodaric-bg-elevated, #f8fafc);
          color: var(--prodaric-text, #0f172a);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        button:hover {
          background: var(--prodaric-surface, #f1f5f9);
          border-color: var(--prodaric-border-strong, #cbd5e1);
        }
        button:focus-visible { outline: 2px solid var(--prodaric-color-primary, #2563eb); outline-offset: 2px; }
      </style>
      <button type="button"><slot></slot></button>
    `;
    const btn = shadow.querySelector('button')!;
    const type = this.getAttribute('type');
    if (type) btn.setAttribute('type', type);
  }
}
