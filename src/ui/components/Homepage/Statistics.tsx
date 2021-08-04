import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatNumber } from '@polkadot/util';
import { StarIcon as StarIconOutline } from '@heroicons/react/outline';
import { StarIcon as StarIconFill } from '@heroicons/react/solid';
import { useCanvas, useDatabase } from 'ui/contexts';
import { useStatistics } from 'ui/hooks';

export function Statistics (): React.ReactElement | null {
  const { api } = useCanvas();
  const { user } = useDatabase();

  const [blockNumber, setBlockNumber] = useState(0);
  const { data: statistics } = useStatistics();

  useEffect(
    () => {
      try {
        async function listenToBlocks () {
          return api?.rpc.chain.subscribeNewHeads((header) => {
            setBlockNumber(header.number.toNumber());
          });
        }

        listenToBlocks().then().catch(console.error);
      } catch (e) {
        console.error(e);
      }
    },
    [api]
  )

  const entries = useMemo(
    (): Record<string, React.ReactNode> => {
      return {
        'Highest Block': `#${formatNumber(blockNumber)}`,
        'Nodes': 1,
        'Code Bundles Uploaded': statistics?.codeBundlesCount || 0,
        'Contracts Instantiated': statistics?.contractsCount || 0,
      }
    },
    [blockNumber, statistics]
  )

  const onClickStar = useCallback(
    (id: string) => () => {
      if (!user) {
        console.error('Not signed in');
      }

      console.error('Toggled code bundle star ' + id)
    },
    []
  );
  
  return (
    <>
      <div className="flex flex-wrap w-full mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
        <div className="text-sm mb-4 flex-grow w-full">
          Canvas Metrics
        </div>
        {Object.entries(entries).map(([label, value], i) => {
          return (
            <div key={`entry-${i}`} className="w-1/2 mb-4">
              <div className="text-xs mb-1">
                {label}
              </div>
              <div className="dark:text-gray-400">
                {value}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap w-full">
        <div className="text-sm mb-4 flex-grow w-full">
          Popular Contract Code
        </div>
        {statistics?.mostPopularCodeBundles.map(({ id, name, instances, stars }, i) => {
          const isStarred = user?.contractsStarred.includes(id);

          const Star = isStarred ? StarIconFill : StarIconOutline;
          
          return (
            <div key={`code-bundle-${i}`} className="w-1/2 mb-4">
              <div className="text-xs mb-1">
                {name}
              </div>
              <button
                className="flex text-xs dark:text-gray-400"
                onClick={onClickStar(id)}
              >
                {stars}
                <Star
                  className="w-4 ml-1 mr-2 justify-self-end "
                  aria-hidden="true"
                  fontSize="1.5rem"
                />
                {instances} instances
              </button>
            </div>
          )
        })}
      </div>

    </>
  );
}