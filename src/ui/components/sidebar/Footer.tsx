import React, { useState } from 'react';
import { ChatAltIcon, CogIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { HelpModal } from 'ui/components/modal';

export function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer className="footer">
      <div>
        <a
          className="flex content-center text-xs font-medium dark:text-gray-500 text-gray-600 dark:hover:text-gray-300 hover:text-gray-400 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <ChatAltIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          Help &amp; Feedback
        </a>
        <Link to="/settings">
          <CogIcon
            className="h-4 w-4 dark:text-gray-500 dark:hover:text-gray-300 text-gray-600 hover:text-gray-400"
            aria-hidden="true"
          />
        </Link>
      </div>
      <HelpModal setIsOpen={setIsOpen} isOpen={isOpen} />
    </footer>
  );
}
