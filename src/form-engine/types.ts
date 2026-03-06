/**
 * Contrato de LayoutSchema para el Form Engine (alineado con /api/resource/layout).
 * Misma forma que @prodaric/shell/common para poder renderizar sin depender del shell.
 */

export interface ValidationRule {
  type: string;
  message?: string;
  value?: unknown;
}

export interface LayoutField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean' | 'relation' | 'currency';
  required: boolean;
  readOnly: boolean;
  validation?: ValidationRule[];
}

export interface LayoutTab {
  id: string;
  label: string;
  fields: string[];
}

export interface LayoutSchema {
  resource: string;
  tabs: LayoutTab[];
  fields: LayoutField[];
}

export type FormValues = Record<string, string | number | boolean | null>;
