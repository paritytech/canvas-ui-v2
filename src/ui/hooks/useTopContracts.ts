// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import { findTopContracts } from 'db/queries';

import type { ContractDocument, UseQuery } from 'types';

export function useTopContracts(): UseQuery<ContractDocument[]> {
  const { db } = useDatabase();

  const query = useCallback((): Promise<ContractDocument[] | null> => {
    return findTopContracts(db);
  }, []);

  return useQuery(query);
}
