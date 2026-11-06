import React from 'react';
import LocalDirectoryPage from './LocalDirectoryPage.jsx';

/**
 * GovernmentPage is preserved as a backwards-compatible alias to LocalDirectoryPage
 */
export default function GovernmentPage(props) {
  return <LocalDirectoryPage {...props} />;
}
