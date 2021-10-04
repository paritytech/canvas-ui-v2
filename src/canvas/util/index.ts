// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { compactAddLength, u8aToU8a } from '@polkadot/util';
import { randomAsU8a } from '@polkadot/util-crypto';
import {
  Abi,
  Bytes,
  ContractPromise,
  AnyJson,
  DispatchError,
  ApiPromise,
  AbiParam,
} from 'types';

export function handleDispatchError(dispatchError: DispatchError, api: ApiPromise): void {
  if (dispatchError.isModule) {
    const decoded = api.registry.findMetaError(dispatchError.asModule);
    console.error('Error sending transaction: ', decoded);
  } else {
    console.error(`Error sending transaction: ${dispatchError}`);
  }
}

export const saveInLocalStorage = (contract: ContractPromise) => {
  const storedInstances = localStorage.getItem('contracts');
  const st = storedInstances ? Array.from(JSON.parse(storedInstances)) : [];
  st.push(contract);
  window.localStorage.setItem('contracts', JSON.stringify(st));
};

export const getInstancesFromStorage = () => {
  const storedInstances = localStorage.getItem('contracts');
  return storedInstances ? (JSON.parse(storedInstances) as ContractPromise[]) : [];
};

export const getInstanceFromStorage = (
  addr: string,
  api: ApiPromise | null
): ContractPromise | null => {
  let contract: ContractPromise | null = null;
  const stored = getInstancesFromStorage().find(({ address }) => addr === address.toString());
  try {
    if (stored && api) {
      contract = new ContractPromise(api, stored.abi.json, stored.address);
    }
  } catch (error) {
    throw new Error('Error creating contract promise');
  }
  return contract;
};

export const convertMetadata = (metadata: unknown, api: ApiPromise | null) => {
  return new Abi(metadata as AnyJson, api?.registry.getChainProperties());
};

const EMPTY_SALT = new Uint8Array();

export function encodeSalt(salt: Uint8Array | string | null = randomAsU8a()): Uint8Array {
  return salt instanceof Bytes
    ? salt
    : salt && salt.length
    ? compactAddLength(u8aToU8a(salt))
    : EMPTY_SALT;
}

export function createEmptyValues(args?: AbiParam[]) {
  const o: Record<string, string> = {};
  if (args) {
    args.map(arg => {
      o[arg.name] = '';
    });
  }
  return o;
}
// export function createOptions<T>(data?: Array<T>, kind?: string): DropdownOption<T>[] | [] {
//   if (data) {
//     switch (kind) {
//       case 'message':
//         return (data as AbiMessage[]).map(c => ({ name: c.identifier, value: c }));
//       case 'pair':
//         return (data as Partial<KeyringPair>[]).map(pair => ({
//           value: pair.address || '',
//           name: (pair.meta?.name as string).toUpperCase(),
//         }));
//       default:
//         return (data as string[]).map(h => ({ name: h.toString(), value: h.toString() }));
//     }
//   }
//   return [];
// }

export function isNumeric(type: string) {
  const numTypes = [
    'Compact<Balance>',
    'BalanceOf',
    'u8',
    'u16',
    'u32',
    'u64',
    'u128',
    'i8',
    'i16',
    'i32',
    'i64',
    'i128',
  ];
  return numTypes.find(t => type.includes(t)) ? true : false;
}

export function convertToNumber(value: string) {
  return value.includes('.') ? parseFloat(value) : parseInt(value);
}

export function transformUserInput(messageArgs: AbiParam[], userInput: string[]) {
  return messageArgs.map(({ type: { type } }, index) => {
    const value = userInput[index];
    if (type === 'bool') {
      return value === 'true';
    }
    if (type.startsWith('Vec')) {
      return value.split(',').map(subStr => {
        const v = subStr.trim();
        if (isNumeric(type)) {
          return convertToNumber(v);
        }
        return v;
      });
    }
    if (isNumeric(type)) {
      return convertToNumber(value);
    }
    return value;
  });
}
