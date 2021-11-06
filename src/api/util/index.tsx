// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import BN from 'bn.js';
import { compactAddLength, u8aToU8a, isNumber, BN_TEN } from '@polkadot/util';
import { randomAsU8a } from '@polkadot/util-crypto';
import {
  AbiConstructor,
  Bytes,
  DispatchError,
  ApiPromise,
  AbiParam,
  KeyringPair,
  AbiMessage,
  DropdownOption,
} from 'types';
import { MessageSignature } from 'ui/components/message/MessageSignature';

export function handleDispatchError(dispatchError: DispatchError, api: ApiPromise): void {
  if (dispatchError.isModule) {
    const decoded = api.registry.findMetaError(dispatchError.asModule);
    console.error('Error sending transaction: ', decoded);
  } else {
    console.error(`Error sending transaction: ${dispatchError}`);
  }
}

const EMPTY_SALT = new Uint8Array();

export function encodeSalt(salt: Uint8Array | string | null = randomAsU8a()): Uint8Array {
  return salt instanceof Bytes
    ? salt
    : salt && salt.length
    ? compactAddLength(u8aToU8a(salt))
    : EMPTY_SALT;
}

export function createConstructorOptions(data: AbiConstructor[]): DropdownOption<number>[] {
  return data.map((constructor, index) => ({
    name: <MessageSignature message={constructor} />,
    value: index,
  }));
}

export function createMessageOptions(data?: AbiMessage[]): DropdownOption<AbiMessage>[] {
  return (data || []).map(message => ({
    name: <MessageSignature message={message} />,
    value: message,
  }));
}

export function createAccountOptions(data: Partial<KeyringPair>[]): DropdownOption<string>[] {
  return data.map(pair => ({
    value: pair.address || '',
    name: pair.meta?.name as string,
  }));
}

export const NOOP = (): void => undefined;

export function fromBalance(value: BN | null): string {
  if (!value) {
    return '';
  }

  return value.toString();
}

export function toBalance(api: ApiPromise, value: string | number): BN {
  const asString = isNumber(value) ? value.toString() : value;
  const siPower = new BN(api.registry.chainDecimals[0]);

  const isDecimalValue = /^(\d+)\.(\d+)$/.exec(asString);

  if (isDecimalValue) {
    const div = new BN(asString.replace(/\.\d*$/, ''));
    const modString = asString.replace(/^\d+\./, '').substr(0, api.registry.chainDecimals[0]);
    const mod = new BN(modString);

    return div
      .mul(BN_TEN.pow(siPower))
      .add(mod.mul(BN_TEN.pow(new BN(siPower.subn(modString.length)))));
  } else {
    return new BN(asString.replace(/[^\d]/g, '')).mul(BN_TEN.pow(siPower));
  }
}

export function toSats(api: ApiPromise, balance: BN): BN {
  return balance.mul(BN_TEN.pow(new BN(api.registry.chainDecimals)));
}

export function fromSats(api: ApiPromise, sats: BN): BN {
  return sats.div(BN_TEN.pow(new BN(api.registry.chainDecimals)));
}

export function convertToNumber(value: string) {
  return value.includes('.') ? parseFloat(value) : parseInt(value);
}

export function transformUserInput(
  api: ApiPromise,
  messageArgs: AbiParam[],
  values?: Record<string, unknown>
) {
  return messageArgs.map(({ name, type: { type } }) => {
    const value = values ? values[name] : null;

    if (type === 'Balance') {
      return api.registry.createType('Balance', value);
    }

    return value || null;
  });
}
