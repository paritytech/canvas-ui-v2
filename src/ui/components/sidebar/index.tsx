// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Footer } from './Footer';
import { Navigation } from './Navigation';
import { NetworkAndUser } from './NetworkAndUser';
import { QuickLinks } from './QuickLinks';

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-inner">
        <div className="upper">
          <nav aria-label="Sidebar">
            <NetworkAndUser />
            <Navigation />
            <QuickLinks />
          </nav>
        </div>
        <Footer />
      </div>
    </div>
  );
}
