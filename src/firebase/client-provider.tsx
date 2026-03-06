
'use client';

import React, { useMemo, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

/**
 * FirebaseClientProvider initializes the Firebase SDK on the client side
 * and provides the app, firestore, and auth instances to its children
 * via a React Context.
 */
export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  const instances = useMemo(() => {
    try {
      // Check for required configuration keys. 
      // If they are missing, "mock-api-key", or stringified "undefined", we skip initialization.
      if (!firebaseConfig.apiKey || 
          firebaseConfig.apiKey === "mock-api-key" || 
          firebaseConfig.apiKey === "undefined" ||
          !firebaseConfig.projectId) {
        return null;
      }
      
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const auth = getAuth(app);
      
      return { app, db, auth };
    } catch (e: any) {
      console.error("Firebase Initialization Error:", e);
      setError(e.message);
      return null;
    }
  }, []);

  // If Firebase could not be initialized (e.g., missing API key), 
  // we show a descriptive alert and do NOT render the children.
  // This prevents crashes in components that rely on the Firebase context.
  if (!instances) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Alert variant="destructive" className="max-w-md border-primary/20 bg-primary/10 shadow-2xl rounded-[2rem]">
          <AlertTitle className="text-primary font-headline font-bold text-lg mb-2 uppercase tracking-tighter">
            Cosmic Link Not Established
          </AlertTitle>
          <AlertDescription className="text-foreground text-xs font-bold leading-relaxed opacity-80 uppercase tracking-widest">
            Sankhya AI requires a valid Firebase configuration to map your earthly data into the intelligence matrix. 
            Please provide your API keys in the project settings.
            {error && (
              <p className="mt-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-[10px] italic opacity-60">
                Diagnostic: {error}
              </p>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <FirebaseProvider firebaseApp={instances.app} firestore={instances.db} auth={instances.auth}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
};
