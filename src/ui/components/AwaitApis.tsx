// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';

import { useApi, useDatabase } from 'ui/contexts';
import { Loader, ConnectionError } from 'ui/components/common';

export function AwaitApis({ children }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const { error, status, keyringStatus, endpoint } = useApi();
  const { db } = useDatabase();
  const [message, setMessage] = useState('');

  const isLoading = !db || keyringStatus !== 'READY' || status !== 'READY';

  useEffect(() => {
    !db && setMessage('Loading data...');
    keyringStatus !== 'READY' && setMessage('Loading accounts...');
    status !== 'READY' && setMessage(`Connecting to ${endpoint}...`);
  }, [db, keyringStatus, status, endpoint]);

  return (
    <>
      {error ? <ConnectionError /> : isLoading ? <Loader message={message} isLoading /> : children}
    </>
  );
}
