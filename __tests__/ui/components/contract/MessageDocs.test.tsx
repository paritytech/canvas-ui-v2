// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MessageDocs } from 'ui/components/message/MessageDocs';
import { AbiMessage, AbiParam } from 'types';

describe('Message Docs', () => {
  const mockMessage = {
    identifier: 'test_message',
    docs: ['This is a test message.', 'It does absolutely `nothing`'],
    args: [{ name: 'TestArg', type: { displayName: 'TestArgType' } }] as AbiParam[],
  } as AbiMessage;

  test.skip('correctly renders a message', () => {
    const { getByText } = render(<MessageDocs message={mockMessage} />);
    const title = getByText(mockMessage.identifier);

    expect(title).toHaveClass('text-yellow-400');
  });
  test.skip('correctly renders a constructor', () => {
    const { getByText } = render(<MessageDocs message={{ ...mockMessage, isConstructor: true }} />);
    const title = getByText(mockMessage.identifier);
    expect(title).toHaveClass('text-blue-400');
  });
  test.skip('renders title and documentation with markdown', () => {
    const { getByText, container } = render(<MessageDocs message={mockMessage} />);
    expect(getByText('test_message')).toBeInTheDocument();
    expect(container.getElementsByTagName('code').length).toBeGreaterThan(0);
  });
});
