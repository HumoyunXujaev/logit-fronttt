'use client';

import { useEffect } from 'react';
import { initApiClient } from '@/lib/api';

export function ApiInitializer() {
  useEffect(() => {
    // Re-initialize API client when the component mounts
    // This ensures we're using the latest environment variables
    console.log('Initializing API client from environment variables');
    initApiClient();
  }, []);

  // This component doesn't render anything
  return null;
}
