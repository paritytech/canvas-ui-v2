import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, CodeIcon, UploadIcon } from '@heroicons/react/outline';
import { Page } from 'ui/templates';

export function AddContract() {
  return (
    <Page
      header="Add New Contract"
      help={
        <>
          You can upload and instantiate new contract code, or use contract code that already exists
          on-chain.
        </>
      }
    >
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="mt-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="mt-4">
                  <Link
                    to="/instantiate"
                    className="flex justify-between items-center px-6 py-4 border text-gray-500 dark:border-gray-700 border-gray-200 rounded-md dark:bg-elevation-1 dark:hover:bg-elevation-2 hover:bg-gray-100"
                  >
                    <div className="flex items-center text-base dark:text-gray-300 text-gray-500 space-x-2">
                      <UploadIcon className="h-8 w-8 dark:text-gray-500 text-gray-400 group-hover:text-gray-500" />
                      <span>Upload New Contract Code</span>
                    </div>
                    <ChevronRightIcon className="h-6 w-6 dark:text-gray-500 text-gray-400" />
                  </Link>
                  <p className="text-center text-sm text-gray-500 py-6">Or</p>
                  <Link
                    to="/hash-lookup"
                    className="flex justify-between items-center px-6 py-4 border text-gray-500 dark:border-gray-700 border-gray-200 rounded-md dark:bg-elevation-1 dark:hover:bg-elevation-2 hover:bg-gray-100"
                  >
                    <div className="flex items-center text-base dark:text-gray-300 text-gray-500 space-x-2">
                      <CodeIcon className="h-8 w-8 dark:text-gray-500 text-gray-400 group-hover:text-gray-500" />
                      <span>Use Existing Contract Code</span>
                    </div>
                    <ChevronRightIcon className="h-6 w-6 dark:text-gray-500 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
