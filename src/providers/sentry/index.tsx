'use effect';
import * as Sentry from '@sentry/nextjs';
import { FC, PropsWithChildren, useEffect } from 'react';

export const SentryProvider: FC<PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        Sentry.init({
            dsn: 'https://35aeaa2684c80c6d729741cc0f5e8da4@o4507726564950016.ingest.de.sentry.io/4507736233148496',
            // Replay may only be enabled for the client-side
            integrations: [Sentry.replayIntegration()],

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for tracing.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,

            // Capture Replay for 10% of all sessions,
            // plus for 100% of sessions with an error
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,

            // ...

            // Note: if you want to override the automatic release value, do not set a
            // `release` value here - use the environment variable `SENTRY_RELEASE`, so
            // that it will also get attached to your source maps
        });
    }, []);

    return children;
};
