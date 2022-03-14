import BN from 'bn.js';
import type {
  AbiMessage,
  AnyJson,
  Codec,
  ContractPromise,
  KeyringPair,
  RegistryError,
} from '../substrate';

export interface ContractDryRunParams {
  contract: ContractPromise;
  message: AbiMessage;
  payment: BN;
  sender: KeyringPair;
  argValues?: Record<string, unknown>;
}

export interface CallResult {
  data: Codec | null;
  id: number;
  isComplete: boolean;
  log: string[];
  message: AbiMessage;
  blockHash?: string;
  error?: RegistryError;
  info?: Record<string, AnyJson>;
  time: number;
}
