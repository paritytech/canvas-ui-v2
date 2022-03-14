import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar, AwaitApis } from 'ui/components';
import {
  ApiContextProvider,
  DatabaseContextProvider,
  TransactionsContextProvider,
  ThemeContextProvider,
} from 'ui/contexts';

const App = (): JSX.Element => {
  return (
    <ThemeContextProvider>
      <ApiContextProvider>
        <DatabaseContextProvider>
          <TransactionsContextProvider>
            <div className="relative md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900 dark:text-white text-black">
              <Sidebar />
              <AwaitApis>
                <Outlet />
              </AwaitApis>
            </div>
          </TransactionsContextProvider>
        </DatabaseContextProvider>
      </ApiContextProvider>
    </ThemeContextProvider>
  );
};

export default App;
