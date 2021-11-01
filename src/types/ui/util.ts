// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import type { AnyJson, Abi } from '../substrate';

export type { BN };

export type OrFalsy<T> = T | null | undefined;

export type OrNull<T> = T | null;

export type OrUndef<T> = T | undefined;

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type UseState<T> = [T, SetState<T>];

export type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

export type ValidateFn<T> = (_: OrFalsy<T>) => Validation;

export interface Validation {
  isError?: boolean;
  isSuccess?: boolean;
  isTouched?: boolean;
  isValid?: boolean;
  isWarning?: boolean;
  message?: React.ReactNode;
}

export interface FileState {
  data: Uint8Array;
  name: string;
  size: number;
}

export interface MetadataState extends Validation {
  source: AnyJson | null;
  name: string | null;
  value: Abi | null;
  isSupplied: boolean;
}
