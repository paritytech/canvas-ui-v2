import React, {
  HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useApi } from './ApiContext';
import { init } from 'db/util';
import type { DbState } from 'types';
import { findMyContracts, getUser } from 'db';

export const DbContext: React.Context<DbState> = React.createContext({} as unknown as DbState);
export const DbConsumer: React.Consumer<DbState> = DbContext.Consumer;
export const DbProvider: React.Provider<DbState> = DbContext.Provider;

const INITIAL = { isDbReady: false } as unknown as DbState;

export function DatabaseContextProvider({
  children,
}: HTMLAttributes<HTMLDivElement>): JSX.Element | null {
  const { status, blockOneHash, endpoint } = useApi();

  const [state, setState] = useState<DbState>(INITIAL);

  const isRemote = useMemo(
    (): boolean => false, // !isDevelopment
    []
  );

  useEffect((): void => {
    status === 'READY' &&
      !!blockOneHash &&
      init(endpoint, blockOneHash, isRemote)
        .then(([db, user, identity]): void => {
          setState(state => ({ ...state, db, user, identity, isDbReady: true }));
        })
        .catch(e => {
          console.error(e);
        });
  }, [blockOneHash, endpoint, isRemote, status]);

  const refreshUserData = useCallback(async (): Promise<void> => {
    const user = await getUser(state.db, state.identity);
    const myContracts = await findMyContracts(state.db, state.identity);

    setState(state => ({ ...state, user, myContracts }));
  }, [state.db, state.identity]);

  useEffect((): void => {
    if (state.isDbReady) {
      refreshUserData().then().catch(console.error);
    }
  }, [refreshUserData, state.isDbReady]);

  return <DbContext.Provider value={{ ...state, refreshUserData }}>{children}</DbContext.Provider>;
}

export function useDatabase(): DbState {
  return useContext(DbContext);
}
