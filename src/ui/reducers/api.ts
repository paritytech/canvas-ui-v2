// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Reducer } from 'react';
import { INIT_STATE, NULL_CHAIN_PROPERTIES } from '../../constants';
import type { ApiAction, ApiState } from 'types';

export const apiReducer: Reducer<ApiState, ApiAction> = (state, action) => {
  switch (action.type) {
    case 'SET_ENDPOINT':
      return { ...INIT_STATE, status: 'CONNECT_INIT', endpoint: action.payload };

    case 'CONNECT_INIT':
      return { ...state, status: 'CONNECT_INIT' };

    case 'CONNECT':
      return { ...state, api: action.payload, error: null, status: 'CONNECTING' };

    case 'CONNECT_READY':
      return { ...state, ...action.payload, error: null, status: 'READY' };

    case 'CONNECT_ERROR':
      return { ...state, ...NULL_CHAIN_PROPERTIES, status: 'ERROR', error: action.payload };

    case 'LOAD_KEYRING':
      return { ...state, keyringStatus: 'LOADING' };

    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringStatus: 'READY' };

    case 'KEYRING_ERROR':
      return { ...state, keyringStatus: 'ERROR' };

    default:
      throw new Error(`Unknown action type`);
  }
};
