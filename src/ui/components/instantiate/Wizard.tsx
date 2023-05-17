// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DryRun } from './DryRun';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { useInstantiate } from 'ui/contexts';

export function Wizard() {
  const {
    step,
    data: { metadata },
  } = useInstantiate();

  return (
    <div className="m-1 flex w-full">
      <main className="xs:w-full p-4 md:mr-2 md:flex-1">
        <Step1 />
        {metadata && <Step2 />}
        {step === 3 && <Step3 />}
      </main>
      {step === 2 && (
        <aside className="xs:w-full md:w-1/3">
          <DryRun />
        </aside>
      )}
    </div>
  );
}
