/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

/**
 * @author Tyler Holewinski (tsh6656@rit.edu)
 *
 * Do I know how to write a service worker? no, I do not
 * however, what I do know that I was *no caching* at all since when it was implemented,
 * it often lead to stale spending data.
 */

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

/**
 * override existing service worker, if one exists
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
 */
self.addEventListener('install', (e) => {
    self.skipWaiting();
});
