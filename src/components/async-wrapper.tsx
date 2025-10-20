"use client";

import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface AsyncWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

export const AsyncWrapper = ({
  children,
  fallback = <p>Loading...</p>,
  errorFallback = <p>Something went wrong.</p>,
}: AsyncWrapperProps) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};
