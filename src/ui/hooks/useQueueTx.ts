// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableResult } from '@polkadot/api';
import { VoidFn } from '@polkadot/api/types';
import { isNull } from '@polkadot/util';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SubmittableExtrinsic } from 'types';
import { useTransactions } from 'ui/contexts/TransactionsContext';

export function useQueueTx(
  extrinsic: SubmittableExtrinsic<'promise'> | null,
  accountId: string | null | undefined,
  onSuccess: (_: SubmittableResult) => Promise<void>,
  onError: VoidFn,
  isValid: (_: SubmittableResult) => boolean
): [VoidFn, VoidFn, boolean, boolean] {
  const { queue, unqueue, process, txs } = useTransactions();
  const [txId, setTxId] = useState<number | null>(null);

  const txIdRef = useRef(txId);

  const isProcessing = useMemo(
    (): boolean => !!txs.find(({ id }) => txId === id)?.isProcessing,
    [txs, txId]
  );

  const onSubmit = useCallback((): void => {
    txId && process(txId);
  }, [process, txId]);

  const onCancel = useCallback((): void => {
    txId && unqueue(txId);
  }, [unqueue, txId]);

  useEffect((): void => {
    if (extrinsic && accountId && isNull(txId)) {
      const newId = queue({ extrinsic, accountId, onSuccess, onError, isValid });

      setTxId(newId);
      txIdRef.current = newId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [onSubmit, onCancel, !isNull(txId), isProcessing];
}
