import { useCallback } from 'react';
import { useFormField } from './useFormField';
import type { ValidFormField, Validation } from 'types';

export function useNonEmptyString(initialValue = ''): ValidFormField<string> {
  const validate = useCallback((value?: string | null): Validation => {
    if (!value || value.length === 0) {
      return { isValid: false, message: 'Value cannot be empty' };
    }

    return { isValid: true };
  }, []);
  return useFormField(initialValue, validate);
}
