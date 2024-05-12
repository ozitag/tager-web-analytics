import { useEffect, useRef } from 'react';
import TagManager from 'react-gtm-module';
import { Router } from 'next/router';

import { Nullable } from '@tager/web-core';

import { getAnalyticsSettings } from '../services/requests';
import googleAnalytics from '../services/googleAnalytics';
import googleOptimize from '../services/googleOptimize';
import yandexMetrika from '../services/yandexMetrika';
import facebookPixel from '../services/facebookPixel';
import pinterest from '../services/pinterest';
import tiktokPixel from '../services/tiktokPixel';
import { gtagManager } from '../services/gtag';
import { AnalyticsSettingsType } from '../typings/model';

type Keys = Partial<AnalyticsSettingsType>;

function getEnvKeys(): Keys {
  return {
    googleTagManagerId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID,
    googleAnalytics4MeasurementId:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS4_MEASUREMENT_ID,
    yandexCounterId: process.env.NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID,
    googleOptimizeId: process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID,
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    pinterestId: process.env.NEXT_PUBLIC_PINTEREST_ID,
  };
}

function createKeyResolver(params: {
  useBackend: boolean;
  userKeys: Keys;
  backendKeys: Keys;
}): (name: keyof Keys) => Nullable<string> {
  const envKeys = getEnvKeys();

  return function resolveAnalyticsKey(name) {
    if (Object.keys(params.userKeys).includes(name)) {
      return params.userKeys[name] ?? null;
    }

    const valueFromBackend = params.useBackend
      ? params.backendKeys[name]
      : null;

    const valueFromEnv = envKeys[name];

    return valueFromBackend || valueFromEnv || null;
  };
}

type Options = {
  timeout?: number;
  keys?: Keys;
  useBackend?: boolean;
};

function useAnalytics(userOptions: Options = {}) {
  const optionsRef = useRef<Options>(userOptions);

  useEffect(() => {
    const { current: options } = optionsRef;

    const timeout = options.timeout ?? 2000;
    const useBackend = options.useBackend ?? true;
    const userKeys = options.keys ?? {};

    const routeChangeListenerList: Array<() => void> = [];

    function handleRouteChangeComplete() {
      routeChangeListenerList.forEach((listener) => listener());
    }

    function initTrackers(): void {
      const settingsPromise: Promise<Partial<AnalyticsSettingsType>> =
        useBackend
          ? getAnalyticsSettings().then((response) => response.data)
          : Promise.resolve({});

      settingsPromise
        .then((backendKeys) => {
          const resolveKey = createKeyResolver({
            useBackend,
            userKeys,
            backendKeys,
          });

          /** Google Tag Manager */
          const googleTagManagerId = resolveKey('googleTagManagerId');

          if (googleTagManagerId) {
            TagManager.initialize({
              gtmId: googleTagManagerId,
            });
          }

          /** Google Analytics */
          const googleAnalyticsId = resolveKey('googleAnalyticsId');

          if (googleAnalyticsId) {
            googleAnalytics.init(googleAnalyticsId);
            googleAnalytics.trackPageView();

            routeChangeListenerList.push(() => googleAnalytics.trackPageView());
          }

          /** Google Analytics 4 (via gtag.js)  */
          const googleAnalytics4MeasurementId = resolveKey(
            'googleAnalytics4MeasurementId'
          );

          if (googleAnalytics4MeasurementId) {
            gtagManager.init(googleAnalytics4MeasurementId);
          }

          /** Yandex Metrika */
          const yandexCounterId = resolveKey('yandexCounterId');

          if (yandexCounterId) {
            yandexMetrika.init(yandexCounterId);
            yandexMetrika.trackPageView();

            routeChangeListenerList.push(() => yandexMetrika.trackPageView());
          }

          /** Facebook Pixel */
          const facebookPixelId = resolveKey('facebookPixelId');

          if (facebookPixelId) {
            facebookPixel.init(facebookPixelId);
            facebookPixel.trackPageView();

            routeChangeListenerList.push(() => facebookPixel.trackPageView());
          }

          /** Tiktok Pixel */
          const tiktokPixelId = resolveKey('tiktokPixelId');

          if (tiktokPixelId) {
            tiktokPixel.init(tiktokPixelId);
            tiktokPixel.trackPageView();

            routeChangeListenerList.push(() => tiktokPixel.trackPageView());
          }

          /** Google Optimize */
          const googleOptimizeId = resolveKey('googleOptimizeId');

          if (googleOptimizeId) {
            googleOptimize.init(googleOptimizeId);
          }

          /** Pinterest */
          const pinterestId = resolveKey('pinterestId');

          if (pinterestId) {
            pinterest.init(pinterestId);
          }
        })
        .catch(() => {
          console.error('Analytics initialization has been failed!');
        });
    }

    setTimeout(initTrackers, timeout);

    Router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);
}

export default useAnalytics;
