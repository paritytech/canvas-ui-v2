// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiState } from 'types';

export const LOCAL_NODE = 'ws://127.0.0.1:9944'; //wss://canvas-rpc.parity.io
export const DEFAULT_DECIMALS = 12;

export const NULL_CHAIN_PROPERTIES = {
  blockZeroHash: null,
  systemName: null,
  systemVersion: null,
  tokenDecimals: DEFAULT_DECIMALS,
  tokenSymbol: 'Unit',
};

export const INIT_STATE: ApiState = {
  ...NULL_CHAIN_PROPERTIES,
  endpoint: LOCAL_NODE,
  keyringStatus: null,
  error: null,
  status: 'CONNECT_INIT',
} as unknown as ApiState;
