// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { classes } from 'ui/util';

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Buttons({ children, className }: Props): React.ReactElement<Props> {
  return <div className={classes('flex space-x-2 mt-16', className)}>{children}</div>;
}
