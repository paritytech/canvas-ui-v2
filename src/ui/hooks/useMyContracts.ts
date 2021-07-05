// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import { findMyContracts } from 'db/queries';

import type { MyContracts, UseQuery } from 'types/db';

export function useMyContracts(): UseQuery<MyContracts> {
  const { db, identity } = useDatabase();

  const query = useCallback((): Promise<MyContracts | null> => {
    return findMyContracts(db, identity);
  }, []);

  return useQuery(query);
}
