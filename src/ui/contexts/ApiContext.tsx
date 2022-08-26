// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useEffect, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { web3Accounts, web3Enable, web3EnablePromise } from '@polkadot/extension-dapp';
import { WsProvider } from '@polkadot/api';
import { RPC } from '../../constants';
import { ApiPromise, ApiState, ChainProperties, InjectedAccount } from 'types';
import { isValidWsUrl } from 'api';
import { useLocalStorage } from 'ui/hooks/useLocalStorage';
import { getChainProperties } from 'api/chainProps';

export const ApiContext = createContext<ApiState | undefined>(undefined);

export const ApiContextProvider = ({ children }: React.PropsWithChildren<Partial<ApiState>>) => {
  const [searchParams] = useSearchParams();
  const rpcUrl = searchParams.get('rpc');
  const [preferredEndpoint, setPreferredEndpoint] = useLocalStorage<string>(
    'contractsUiPreferredEndpoint',
    RPC.CONTRACTS
  );
  const [api, setApi] = useState<ApiPromise>();
  const [endpoint, setEndpoint] = useState<string>(preferredEndpoint);
  const [accounts, setAccounts] = useState<InjectedAccount[]>();
  const [chainProps, setChainProps] = useState<ChainProperties>({} as ChainProperties);

  useEffect(() => {
    if (rpcUrl && isValidWsUrl(rpcUrl) && rpcUrl !== preferredEndpoint) {
      setEndpoint(rpcUrl);
      setPreferredEndpoint(rpcUrl);
      window.location.reload();
    }
  }, [preferredEndpoint, rpcUrl, searchParams, setPreferredEndpoint]);

  useEffect((): void => {
    async function connect() {
      const wsProvider = new WsProvider(endpoint);
      const _api = await ApiPromise.create({ provider: wsProvider });
      const _chainProps = await getChainProperties(_api);
      setApi(_api);
      setChainProps(_chainProps);
    }
    connect().catch(e => console.error(e));
  }, [endpoint]);

  useEffect(() => {
    const getAccounts = async () => {
      !web3EnablePromise && (await web3Enable('contracts-ui'));
      const _acc = await web3Accounts();
      setAccounts(_acc);
    };
    getAccounts().catch(e => console.error(e));
  }, []);

  return (
    <ApiContext.Provider
      value={{
        api,
        accounts,
        setEndpoint,
        endpoint,
        ...chainProps,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
