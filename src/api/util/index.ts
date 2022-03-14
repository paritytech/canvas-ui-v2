import BN from 'bn.js';
import { compactAddLength, u8aToU8a, isNumber, BN_TEN } from '@polkadot/util';
import { randomAsU8a } from '@polkadot/util-crypto';
import { MAX_CALL_WEIGHT } from '../../constants';
import { Bytes, ApiPromise, AbiParam, Registry, OrFalsy, Weight } from 'types';

const EMPTY_SALT = new Uint8Array();

export function maximumBlockWeight(api: OrFalsy<ApiPromise>): Weight {
  return api?.consts.system.blockWeights
    ? api.consts.system.blockWeights.maxBlock
    : (api?.consts.system.maximumBlockWeight as Weight) || MAX_CALL_WEIGHT;
}

export function encodeSalt(salt: Uint8Array | string | null = randomAsU8a()): Uint8Array {
  return salt instanceof Bytes
    ? salt
    : salt && salt.length
    ? compactAddLength(u8aToU8a(salt))
    : EMPTY_SALT;
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
  registry: Registry,
  messageArgs: AbiParam[],
  values?: Record<string, unknown>
) {
  return messageArgs.map(({ name, type: { type } }) => {
    const value = values ? values[name] : null;

    if (type === 'Balance') {
      return registry.createType('Balance', value);
    }

    return value || null;
  });
}

export function isValidWsUrl(s: unknown) {
  if (typeof s === 'string') {
    let url;
    try {
      url = new URL(s);
    } catch (_) {
      return false;
    }

    return url.protocol === 'ws:' || url.protocol === 'wss:';
  }
  return false;
}
