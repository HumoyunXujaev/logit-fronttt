'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Globe, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

/**
 * Component that handles SSL certificate warnings and guides users
 * on how to proceed with self-signed certificates
 */
const CertificateWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [browser, setBrowser] = useState<string>('');

  useEffect(() => {
    // Only show the warning if we detected a certificate error
    const checkForCertErrors = () => {
      // Check if we're in a secure context
      if (window.isSecureContext && window.location.protocol === 'https:') {
        // We're on HTTPS but might have certificate errors
        // We can't directly detect cert errors, but we can check if this is the user's first visit
        const hasAcknowledgedCert = localStorage.getItem(
          'acknowledgedCertWarning'
        );

        if (!hasAcknowledgedCert) {
          setShowWarning(true);
          detectBrowser();
        }
      }
    };

    // Detect user's browser for specific instructions
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf('Chrome') > -1) {
        setBrowser('chrome');
      } else if (userAgent.indexOf('Safari') > -1) {
        setBrowser('safari');
      } else if (userAgent.indexOf('Firefox') > -1) {
        setBrowser('firefox');
      } else if (
        userAgent.indexOf('MSIE') > -1 ||
        userAgent.indexOf('Trident') > -1
      ) {
        setBrowser('ie');
      } else {
        setBrowser('other');
      }
    };

    checkForCertErrors();
  }, []);

  const handleContinue = () => {
    localStorage.setItem('acknowledgedCertWarning', 'true');
    setShowWarning(false);
    // Force reload the page to retry resources
    window.location.reload();
  };

  const renderBrowserInstructions = () => {
    switch (browser) {
      case 'chrome':
        return (
          <ol className='list-decimal ml-5 space-y-2 mt-2'>
            <li>Click on "Advanced" on the warning page</li>
            <li>Click on "Proceed to [website] (unsafe)"</li>
            <li>The browser will remember this for the current session</li>
          </ol>
        );
      case 'safari':
        return (
          <ol className='list-decimal ml-5 space-y-2 mt-2'>
            <li>Click "Show Details" when you see the warning</li>
            <li>Click "visit this website" and confirm</li>
            <li>Enter your Mac password if prompted</li>
          </ol>
        );
      case 'firefox':
        return (
          <ol className='list-decimal ml-5 space-y-2 mt-2'>
            <li>Click "Advanced" on the warning page</li>
            <li>Click "Accept the Risk and Continue"</li>
          </ol>
        );
      default:
        return (
          <p className='mt-2'>
            When you see a certificate warning, look for an "Advanced" or
            "Details" option and then find a way to proceed to the website
            anyway.
          </p>
        );
    }
  };

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <div className='flex items-center'>
            <AlertTriangle className='h-6 w-6 text-amber-500 mr-2' />
            <DialogTitle>Certificate Warning</DialogTitle>
          </div>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <p>
            This site is using a self-signed certificate for demonstration
            purposes. You may see security warnings in your browser.
          </p>

          <div className='bg-amber-50 p-4 rounded-md border border-amber-200'>
            <h3 className='font-semibold flex items-center text-amber-700'>
              <Shield className='h-5 w-5 mr-2' />
              How to proceed in {browser || 'your browser'}:
            </h3>
            {renderBrowserInstructions()}
          </div>

          <div className='rounded-md bg-green-50 p-4 border border-green-200'>
            <h3 className='font-semibold flex items-center text-green-700'>
              <CheckCircle className='h-5 w-5 mr-2' />
              This is safe because:
            </h3>
            <ul className='list-disc ml-5 space-y-1 mt-2 text-green-700'>
              <li>This is only a demonstration site</li>
              <li>You're expecting to see this application</li>
              <li>No sensitive data is being transmitted</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleContinue} className='w-full'>
            I understand, continue to the site
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateWarning;
