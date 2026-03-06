/**
 * @prodaric/ui-engine — Prodaric Framework UI (Web Components, Form Engine, theme).
 */
export const UI_ENGINE_PACKAGE = '@prodaric/ui-engine';

export { registerProdaricComponents } from './register-components';
export { ProdaricBaseComponent, PRODARIC_BASE_CLASS } from './components/base-component';
export { ProdaricButton } from './components/prodaric-button';
export { ProdaricCard } from './components/prodaric-card';

export { renderLayoutSchemaForm } from './form-engine/render-form';
export type { LayoutSchemaFormOptions, LayoutSchemaFormApi } from './form-engine/render-form';
export type {
  LayoutSchema,
  LayoutField,
  LayoutTab,
  ValidationRule,
  FormValues,
} from './form-engine/types';
