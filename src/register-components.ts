/**
 * Registro de Web Components Prodaric en customElements.
 * Llamar una vez al cargar la app (por ejemplo desde el entry del IDE).
 */

import { ProdaricButton } from './components/prodaric-button';
import { ProdaricCard } from './components/prodaric-card';

export function registerProdaricComponents(): void {
  if (!customElements.get(ProdaricButton.tagName)) {
    customElements.define(ProdaricButton.tagName, ProdaricButton);
  }
  if (!customElements.get(ProdaricCard.tagName)) {
    customElements.define(ProdaricCard.tagName, ProdaricCard);
  }
}
