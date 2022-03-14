import { useCallback } from 'react';
import { useDbQuery } from './useDbQuery';
import { searchForCodeBundle } from 'db';
import type { CodeBundleDocument } from 'types';
import { useDatabase } from 'ui/contexts/DatabaseContext';

export function useCodeBundleSearch(fragment: string) {
  const { db } = useDatabase();

  const query = useCallback((): Promise<CodeBundleDocument[] | null> => {
    return searchForCodeBundle(db, fragment);
  }, [db, fragment]);

  return useDbQuery(query);
}
