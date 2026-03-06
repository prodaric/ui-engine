/**
 * Tarjeta Web Component Prodaric.
 * Uso: <prodaric-card><span slot="title">Título</span> Contenido</prodaric-card>
 */

import { ProdaricBaseComponent } from './base-component';

export class ProdaricCard extends ProdaricBaseComponent {
  static readonly tagName = 'prodaric-card';

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          background: var(--prodaric-bg-elevated, #f8fafc);
          border: 1px solid var(--prodaric-border, #e2e8f0);
          border-radius: 8px;
          box-shadow: var(--prodaric-shadow, 0 1px 3px rgba(0,0,0,0.1));
          overflow: hidden;
        }
        .title { padding: 0.75rem 1rem; font-weight: 600; color: var(--prodaric-text, #0f172a); border-bottom: 1px solid var(--prodaric-border, #e2e8f0); }
        .body { padding: 1rem; color: var(--prodaric-text, #0f172a); }
      </style>
      <div class="card">
        <div class="title"><slot name="title">Tarjeta</slot></div>
        <div class="body"><slot></slot></div>
      </div>
    `;
  }
}
