import { ApiPromise, WsProvider } from '@polkadot/api';
import { isValidWsUrl } from './util';
import { getChainPropertiesWhenReady } from './chainProps';
import { ApiAction } from 'types';

export const connect = (endpoint: string, dispatch: React.Dispatch<ApiAction>) => {
  if (!isValidWsUrl(endpoint)) return false;

  dispatch({ type: 'CONNECT_INIT' });

  const provider = new WsProvider(endpoint);
  const _api = new ApiPromise({ provider });

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', async () => {
    dispatch({ type: 'CONNECT', payload: _api });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    await _api.isReady;

    dispatch({
      type: 'CONNECT_READY',
      payload: await getChainPropertiesWhenReady(_api),
    });
  });

  _api.on('ready', async () => {
    dispatch({
      type: 'CONNECT_READY',
      payload: await getChainPropertiesWhenReady(_api),
    });
  });

  _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }));
};
