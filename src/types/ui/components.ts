import React from 'react';
import { Props as ReactSelectProps } from 'react-select';
import { ValidFormField } from './hooks';
import { FileState, SimpleSpread } from './util';

export interface DropdownOption<T> {
  value: T;
  label: React.ReactNode;
}

export type ArgComponentProps<T> = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  ValidFormField<T>
>;

export type DropdownProps<T> = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  ValidFormField<T> &
    Pick<
      ReactSelectProps<DropdownOption<T>, false>,
      'components' | 'formatOptionLabel' | 'isDisabled' | 'isSearchable' | 'options' | 'placeholder'
    >
>;

export type InputFileProps = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    errorMessage?: React.ReactNode;
    isDisabled?: boolean;
    isSupplied?: boolean;
    isError?: boolean;
    onChange: (_: FileState) => void;
    onRemove: () => void;
    successMessage?: React.ReactNode;
    value?: FileState;
  }
>;
