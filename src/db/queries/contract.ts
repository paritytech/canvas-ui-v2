// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import { keyring } from '@polkadot/ui-keyring';
import type { Database, PrivateKey } from '@textile/threaddb';
import moment from 'moment';
import { keyring } from '@polkadot/ui-keyring';
import { publicKeyHex } from '../util';
import { findUser } from './user';
import { getCodeBundleCollection, getContractCollection, pushToRemote } from './util';
import type { ContractDocument, MyContracts } from 'types';

export async function findTopContracts(db: Database): Promise<ContractDocument[]> {
  return getContractCollection(db).find({}).toArray();
}

export async function findMyContracts(
  db: Database,
  identity: PrivateKey | null
): Promise<MyContracts> {
  const user = await findUser(db, identity);

  if (!user) {
    return { owned: [], starred: [] };
  }

  const owned = await getContractCollection(db).find({ owner: user.publicKey }).toArray();
  const existingStarred = await getContractCollection(db)
    .find({ address: { $in: user.contractsStarred } })
    .toArray();

  const starred = user.contractsStarred.map((starredAddress: string) => {
    const match = existingStarred.find(({ address }) => starredAddress === address);

    return {
      isExistent: !!match,
      value: match || { identifier: starredAddress },
    };
  });

  return { owned, starred };
}

export async function findContractByAddress(
  db: Database,
  address: string
): Promise<ContractDocument | null> {
  return (await getContractCollection(db).findOne({ address })) || null;
}

export async function createContract(
  db: Database,
  owner: PrivateKey | null,
  {
    abi,
    address,
    blockOneHash,
    codeBundleId,
    creator,
    date = moment().format(),
    genesisHash,
    name,
    tags = [],
  }: Partial<ContractDocument>,
  savePair = true
): Promise<ContractDocument> {
  try {
    if (!abi || !address || !codeBundleId || !creator || !name || !genesisHash || !blockOneHash) {
      return Promise.reject(new Error('Missing required fields'));
    }

    if (!(await getCodeBundleCollection(db).findOne({ id: codeBundleId }))) {
      return Promise.reject(new Error('Instantiation code bundle is invalid'));
    }

    if (await getContractCollection(db).findOne({ address })) {
      return Promise.reject(new Error('Contract already exists'));
    }

    const newContract = getContractCollection(db).create({
      abi,
      address,
      blockOneHash,
      codeBundleId,
      creator,
      genesisHash,
      name,
      owner: publicKeyHex(owner),
      tags,
      date,
      stars: 1,
    });

    savePair && keyring.saveContract(address, { name, tags, abi });

    await newContract.save();

    await pushToRemote(db, 'Contract');

    return Promise.resolve(newContract);
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function updateContract(
  db: Database,
  address: string,
  { name, tags }: Partial<ContractDocument>,
  savePair = true
): Promise<string> {
  try {
    const contract = await getContractCollection(db).findOne({ address });

    if (contract) {
      if (name) contract.name = name;
      if (tags) contract.tags = tags;

      savePair &&
        keyring.saveContract(address, {
          ...(keyring.getContract(address)?.meta || {}),
          name,
          tags,
        });

      const id = await contract.save();

      await pushToRemote(db, 'Contract');

      return id;
    }

    return Promise.reject(new Error('Contract does not exist'));
  } catch (e) {
    console.error(e);

    return Promise.reject(e);
  }
}

export async function removeContract(
  db: Database,
  address: string,
  savePair = true
): Promise<void> {
  try {
    const existing = await findContractByAddress(db, address);

    // keyring.forgetContract(address);

    if (existing) {
      await getContractCollection(db).delete(existing._id as string);

      savePair && keyring.forgetContract(address);

      await pushToRemote(db, 'Contract');
    }

    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}
