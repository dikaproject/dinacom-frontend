// components/PageWrapper.tsx
"use client"
import { useState, useEffect } from 'react';
import Loading from './Loading';

import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        children
      )}
    </>
  );
}