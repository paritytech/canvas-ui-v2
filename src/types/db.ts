import React from 'react';
import type { Collection, Database } from '@textile/threaddb';
import type { PrivateKey } from '@textile/crypto';
import type { VoidFn } from './substrate';

export type { Collection, Database, PrivateKey };

interface Document {
  _id?: string;
}

export interface UserDocument extends Document {
  codeBundlesStarred: string[];
  contractsStarred: string[];
  creator?: string;
  publicKey: string;
  email?: string;
  name?: string;
}

export interface CodeBundleDocument extends Document {
  abi?: Record<string, unknown>;
  codeHash: string;
  creator: string;
  date: string;
  genesisHash: string;
  id: string;
  instances: number;
  name: string;
  owner?: string;
  stars: number;
  tags?: string[];
}

export interface ContractDocument extends Document {
  abi: Record<string, unknown>;
  address: string;
  codeHash: string;
  creator: string;
  date: string;
  genesisHash: string;
  name: string;
  owner?: string;
  stars: number;
  tags?: string[];
}

export interface DbQuery<T> {
  data: T | null;
  error: React.ReactNode | null;
  isLoading: boolean;
  isValid: boolean;
  refresh: VoidFn;
  updated: number;
}
export type CodeBundle = {
  document: CodeBundleDocument | null;
  isOnChain: boolean;
};

export interface Starred<T> {
  isExistent: boolean;
  value?: T | { identifier: string };
}

export interface UserArtifacts<T> {
  owned: Array<T>;
  starred: Array<Starred<T>>;
}

export interface DbState {
  db: Database;
  user: UserDocument | null;
  myContracts: MyContracts | null;
  refreshUserData: () => void;
  identity: PrivateKey | null;
  isDbReady: boolean;
}

export interface DbStatistics {
  codeBundlesCount: number;
  contractsCount: number;
  mostPopularCodeBundles: CodeBundleDocument[];
}

export type MyCodeBundles = UserArtifacts<CodeBundleDocument>;

export type MyContracts = UserArtifacts<ContractDocument>;
