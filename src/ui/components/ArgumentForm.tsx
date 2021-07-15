import React from 'react';
import type { AbiParam } from 'types';

interface Props {
  args?: Partial<AbiParam>[];
  argValues?: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ArgumentForm = ({ args, handleChange, argValues }: Props) => {
  return args && argValues ? (
    <>
      {args.map(({ name, type = { type: '' } }) => {
        return (
          <div className="mb-4" key={`${name}`}>
            <input
              type="text"
              name={`${name}`}
              id={`${name}`}
              placeholder={`${name}: <${type.type}>`}
              value={argValues[`${name}`]}
              onChange={handleChange}
              className="w-full dark:bg-gray-900 dark:text-gray-300 bg-white dark:border-gray-700 rounded"
            />
          </div>
        );
      })}
    </>
  ) : null;
};
