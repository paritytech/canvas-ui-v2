// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react';
import { customRender, getMockApiState, getMockDbState, mockAbiFlipper } from 'test-utils';
import { InteractTab } from 'ui/components';
import { ApiState, DbState } from 'types';

describe('Contract Interact Tab', () => {
  const mockAddr = '5CXkiX14Axfq3EoncpXduFVyhqRti1ogCF3iUYtBXRLNQpQt';

  const mockCall = jest.fn();

  let mockDbState: DbState;
  let mockApiState: ApiState;

  beforeAll(async () => {
    mockDbState = await getMockDbState();
    mockApiState = getMockApiState();
  });
  afterAll(async () => {
    await mockDbState.db.delete();
  });
  test('renders correctly with initial values', () => {
    const { getByText } = customRender(
      <InteractTab
        abi={mockAbiFlipper}
        contractAddress={mockAddr}
        callFn={mockCall}
        isActive={true}
      />,
      {
        ...mockApiState,
        keyringStatus: 'READY',
        status: 'READY',
      },
      mockDbState
    );
    expect(getByText('Message to send')).toBeInTheDocument();
    expect(getByText('flip')).toBeInTheDocument();
    expect(getByText('Call')).not.toBeDisabled();
  });
  test('call button executes ', () => {
    const { getByText } = customRender(
      <InteractTab
        abi={mockAbiFlipper}
        contractAddress={mockAddr}
        callFn={mockCall}
        isActive={true}
      />,
      {
        ...mockApiState,
        keyringStatus: 'READY',
        status: 'READY',
      },
      mockDbState
    );
    const submitBtn = getByText('Call');
    fireEvent.click(submitBtn);
    expect(mockCall).toHaveBeenCalledTimes(1);
  });
});
