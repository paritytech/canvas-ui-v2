import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useDbQuery } from './useDbQuery';
import { findTopContracts } from 'db/queries';

import type { ContractDocument, DbQuery } from 'types';

export function useTopContracts(): DbQuery<ContractDocument[]> {
  const { db } = useDatabase();

  const query = useCallback((): Promise<ContractDocument[] | null> => {
    return findTopContracts(db);
  }, [db]);

  return useDbQuery(query);
}
