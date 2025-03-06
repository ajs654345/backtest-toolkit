
import React, { useEffect, useState } from 'react';
import { useElectron } from '@/contexts/ElectronContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ElectronInfo = () => {
  const { isElectron, platform, sendToMain, listenToMain } = useElectron();
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    if (isElectron) {
      // Request app version from main process
      sendToMain('get-app-version');
      
      // Listen for version response
      const unsubscribe = listenToMain('app-version', (version: string) => {
        setAppVersion(version);
      });
      
      return unsubscribe;
    }
  }, [isElectron, sendToMain, listenToMain]);

  const handleTestMessage = () => {
    sendToMain('test-message', { text: 'Hello from renderer process!' });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Electron Integration</CardTitle>
        <CardDescription>Information about the current environment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="font-semibold">Environment:</div>
          <div>{isElectron ? 'Electron' : 'Web Browser'}</div>
          
          <div className="font-semibold">Platform:</div>
          <div>{platform}</div>
          
          {appVersion && (
            <>
              <div className="font-semibold">App Version:</div>
              <div>{appVersion}</div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isElectron && (
          <Button onClick={handleTestMessage}>
            Send Test Message
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ElectronInfo;
