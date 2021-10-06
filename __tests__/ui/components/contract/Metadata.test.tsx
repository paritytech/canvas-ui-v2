// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MetadataTab } from 'ui/components';
import { mockAbiFlipper } from 'test-utils';

describe('Contract metadata tab', () => {
  test('renders docs for each mess', () => {
    const { container } = render(<MetadataTab isActive={true} abi={mockAbiFlipper} />);
    const { constructors, messages } = mockAbiFlipper;
    const panels = container.getElementsByClassName('collapsible-panel');
    expect(panels.length).toEqual(constructors.length + messages.length);
  });
});
