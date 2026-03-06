/**
 * Form Engine: renderiza un formulario a partir de un LayoutSchema.
 * Genera campos (text, date, select, boolean, etc.) y expone getValues/setValues.
 */

import type { LayoutSchema, LayoutField, FormValues } from './types';

const FORM_CLASS = 'prodaric-form-engine';
const FIELD_CLASS = 'prodaric-form-field';
const TAB_CLASS = 'prodaric-form-tabs';

function getFieldByName(schema: LayoutSchema, name: string): LayoutField | undefined {
  return schema.fields.find((f) => f.name === name);
}

function createFieldElement(field: LayoutField, value: string | number | boolean | null): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = FIELD_CLASS;
  wrap.dataset.fieldName = field.name;

  const label = document.createElement('label');
  label.htmlFor = `prodaric-field-${field.name}`;
  label.textContent = field.label + (field.required ? ' *' : '');
  wrap.appendChild(label);

  let input: HTMLInputElement | HTMLSelectElement;

  switch (field.type) {
    case 'boolean':
      input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `prodaric-field-${field.name}`;
      input.checked = value === true || value === 'true';
      input.disabled = field.readOnly;
      break;
    case 'select':
      input = document.createElement('select');
      input.id = `prodaric-field-${field.name}`;
      input.disabled = field.readOnly;
      const empty = document.createElement('option');
      empty.value = '';
      empty.textContent = '—';
      input.appendChild(empty);
      // Opciones se podrían extender desde validation/value; por ahora vacío
      if (String(value)) {
        const opt = document.createElement('option');
        opt.value = String(value);
        opt.textContent = String(value);
        opt.selected = true;
        input.appendChild(opt);
      }
      break;
    case 'date':
      input = document.createElement('input');
      input.type = 'date';
      input.id = `prodaric-field-${field.name}`;
      input.value = value != null ? String(value) : '';
      input.disabled = field.readOnly;
      input.required = field.required;
      break;
    case 'currency':
    case 'text':
    default:
      input = document.createElement('input');
      input.type = field.type === 'currency' ? 'text' : 'text';
      input.id = `prodaric-field-${field.name}`;
      input.value = value != null ? String(value) : '';
      input.disabled = field.readOnly;
      input.required = field.required;
      if (field.type === 'currency') input.placeholder = '0,00';
      break;
  }

  wrap.appendChild(input);
  return wrap;
}

export interface LayoutSchemaFormOptions {
  /** Valores iniciales por nombre de campo. */
  initialValues?: FormValues;
  /** Clase CSS adicional en el contenedor. */
  className?: string;
}

export interface LayoutSchemaFormApi {
  getValues(): FormValues;
  setValues(values: FormValues): void;
  destroy(): void;
}

/**
 * Monta un formulario en el contenedor a partir del schema.
 * Devuelve API para leer/escribir valores y destruir.
 */
export function renderLayoutSchemaForm(
  container: HTMLElement,
  schema: LayoutSchema,
  options: LayoutSchemaFormOptions = {}
): LayoutSchemaFormApi {
  const { initialValues = {}, className = '' } = options;
  container.className = [FORM_CLASS, className].filter(Boolean).join(' ');
  container.innerHTML = '';

  const style = document.createElement('style');
  style.textContent = `
    .${FORM_CLASS} { padding: 1rem; font-family: inherit; }
    .${FORM_CLASS} .${FIELD_CLASS} { margin-bottom: 1rem; }
    .${FORM_CLASS} label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.875rem; }
    .${FORM_CLASS} input, .${FORM_CLASS} select { width: 100%; max-width: 24rem; padding: 0.5rem 0.75rem; border: 1px solid var(--prodaric-border, #e2e8f0); border-radius: 6px; background: var(--prodaric-bg, #fff); }
    .${FORM_CLASS} .${TAB_CLASS} { margin-bottom: 1rem; }
    .${FORM_CLASS} .${TAB_CLASS} [role="tabpanel"] { padding-top: 0.5rem; }
  `;
  container.appendChild(style);

  const fieldNamesOrder: string[] = [];

  if (schema.tabs.length === 0) {
    schema.fields.forEach((f) => {
      fieldNamesOrder.push(f.name);
      const el = createFieldElement(f, initialValues[f.name] ?? null);
      container.appendChild(el);
    });
  } else {
    const tabBar = document.createElement('div');
    tabBar.className = TAB_CLASS;
    tabBar.setAttribute('role', 'tablist');
    const panels: HTMLElement[] = [];

    schema.tabs.forEach((tab, idx) => {
      const tabButton = document.createElement('button');
      tabButton.type = 'button';
      tabButton.setAttribute('role', 'tab');
      tabButton.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      tabButton.textContent = tab.label;
      tabBar.appendChild(tabButton);

      const panel = document.createElement('div');
      panel.setAttribute('role', 'tabpanel');
      panel.hidden = idx !== 0;
      panel.dataset.tabId = tab.id;
      tab.fields.forEach((name) => {
        const field = getFieldByName(schema, name);
        if (field) {
          fieldNamesOrder.push(field.name);
          const el = createFieldElement(field, initialValues[field.name] ?? null);
          panel.appendChild(el);
        }
      });
      panels.push(panel);

      tabButton.addEventListener('click', () => {
        panels.forEach((p, i) => {
          p.hidden = i !== idx;
          (tabBar.children[i] as HTMLElement).setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
      });
    });
    container.appendChild(tabBar);
    panels.forEach((p) => container.appendChild(p));
  }

  function getInput(name: string): HTMLInputElement | HTMLSelectElement | null {
    const el = container.querySelector(`[data-field-name="${name}"] input, [data-field-name="${name}"] select`);
    return el as HTMLInputElement | HTMLSelectElement | null;
  }

  function getValues(): FormValues {
    const out: FormValues = {};
    const fieldMap = new Map(schema.fields.map((f) => [f.name, f]));
    fieldNamesOrder.forEach((name) => {
      const field = fieldMap.get(name);
      const input = getInput(name);
      if (!field || !input) return;
      if (field.type === 'boolean') {
        out[name] = (input as HTMLInputElement).checked;
      } else {
        const v = (input as HTMLInputElement).value;
        out[name] = v === '' ? null : v;
      }
    });
    return out;
  }

  function setValues(values: FormValues): void {
    Object.entries(values).forEach(([name, value]) => {
      const input = getInput(name);
      if (!input) return;
      const field = getFieldByName(schema, name);
      if (field?.type === 'boolean') {
        (input as HTMLInputElement).checked = value === true || value === 'true';
      } else {
        (input as HTMLInputElement).value = value != null ? String(value) : '';
      }
    });
  }

  function destroy(): void {
    container.innerHTML = '';
    container.className = '';
  }

  return { getValues, setValues, destroy };
}
