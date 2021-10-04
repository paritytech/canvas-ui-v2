import { BlueprintPromise, CodePromise } from '@polkadot/api-contract';
import { isNumber } from '@polkadot/util';
import { handleDispatchError, encodeSalt, transformUserInput } from '../util';
import type {
  ApiPromise,
  InstantiateState,
  CanvasState,
  DbState,
  SubmittableExtrinsic,
  OnInstantiateSuccess$Code,
  OnInstantiateSuccess$Hash,
} from 'types';
import { createCodeBundle, createContract } from 'db';

export function createInstantiateTx(
  api: ApiPromise,
  {
    argValues: [argValues],
    codeHash,
    constructorIndex: { value: constructorIndex },
    weight: { weight: gasLimit },
    endowment,
    metadata: { value: metadata },
    salt,
  }: InstantiateState
): SubmittableExtrinsic<'promise'> | null {
  const isFromHash = !!codeHash;
  const saltu8a = encodeSalt(salt.value);
  const options = {
    gasLimit,
    salt: saltu8a,
    value: endowment.value ? api.registry.createType('Balance', endowment.value) : undefined,
  };

  const wasm = metadata?.project.source.wasm;
  const isValid = isFromHash || !!wasm;

  if (isValid && metadata && isNumber(constructorIndex) && metadata && argValues) {
    const codeOrBlueprint = isFromHash
      ? new BlueprintPromise(api, metadata, codeHash)
      : new CodePromise(api, metadata, wasm && wasm.toU8a());

    const constructor = metadata.findConstructor(constructorIndex);

    const transformed = transformUserInput(api, constructor.args, argValues);
    // const transformed = [new BN(100000)]

    return constructor.args.length > 0
      ? codeOrBlueprint.tx[constructor.method](options, ...transformed)
      : codeOrBlueprint.tx[constructor.method](options);
  } else {
    throw new Error('Unknown error');
  }
}

export function onInsantiateFromHash(
  { api, blockZeroHash }: CanvasState,
  { db, identity }: DbState,
  { accountId, codeHash, name, onSuccess }: InstantiateState
): OnInstantiateSuccess$Hash {
  return async function ({ contract, dispatchError, status }): Promise<void> {
    if (dispatchError) {
      handleDispatchError(dispatchError, api);
    }

    if (
      accountId.value &&
      name.value &&
      codeHash &&
      contract &&
      (status.isInBlock || status.isFinalized)
    ) {
      await createContract(db, identity, {
        abi: contract.abi.json as Record<string, unknown>,
        address: contract.address.toString(),
        creator: accountId.value,
        blockZeroHash: blockZeroHash || undefined,
        codeHash,
        genesisHash: api?.genesisHash.toString(),
        name: name.value,
        tags: [],
      });

      onSuccess && onSuccess(contract);
    }
  };
}

export function onInstantiateFromCode(
  { api, blockZeroHash }: CanvasState,
  { db, identity }: DbState,
  { accountId, name, onSuccess }: InstantiateState
): OnInstantiateSuccess$Code {
  return async function (result): Promise<void> {
    try {
      const { blueprint, contract, dispatchError, status } = result;

      if (dispatchError) {
        handleDispatchError(dispatchError, api);
      }

      if (accountId.value && name.value && contract && (status.isInBlock || status.isFinalized)) {
        blueprint &&
          (await createCodeBundle(db, identity, {
            abi: blueprint.abi.json as Record<string, unknown>,
            blockZeroHash: blockZeroHash || undefined,
            codeHash: blueprint.codeHash.toHex(),
            creator: accountId.value,
            genesisHash: api.genesisHash.toHex(),
            name: blueprint.abi.project.contract.name.toString(),
            tags: [],
          }));

        await createContract(db, identity, {
          abi: contract.abi.json as Record<string, unknown>,
          address: contract.address.toString(),
          blockZeroHash: blockZeroHash || undefined,
          creator: accountId.value,
          codeHash: blueprint?.codeHash.toHex() || contract.abi.project.source.wasmHash.toHex(),
          genesisHash: api?.genesisHash.toString(),
          name: name.value,
          tags: [],
        });
        // const contract = getInstanceFromEvents(events, api, metadata.value as Abi);
        onSuccess && onSuccess(contract, blueprint);
      }
    } catch (e) {
      console.error(e);
    }
  };
}
