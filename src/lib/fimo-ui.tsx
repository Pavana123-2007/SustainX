import React from 'react';

// Minimal implementation of @fimo/ui for internationalization
export type FimoString = string;

export function useTranslations() {
  return {
    t: (key: string, defaultValue: string) => defaultValue,
  };
}

export function fimo(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
}

export function Text({ value, as = 'span', className }: { value: string; as?: keyof JSX.IntrinsicElements; className?: string }) {
  const Component = as;
  return <Component className={className}>{value}</Component>;
}
