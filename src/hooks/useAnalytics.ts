import { useEffect, useRef } from 'react';
import TagManager from 'react-gtm-module';
import { Router } from 'next/router';

import { getAnalyticsSettings } from '../services/requests';
import googleAnalytics from '../services/googleAnalytics';
import yandexMetrika from '../services/yandexMetrika';
import facebookPixel from '../services/facebookPixel';
import { AnalyticsSettingsType } from '../typings/model';

type Options = {
  timeout?: number;
  keys?: Partial<AnalyticsSettingsType>;
  useBackend?: boolean;
};

function useAnalytics(userOptions?: Options) {
  const optionsRef = useRef<Options>({
    useBackend: userOptions?.useBackend ?? true,
    timeout: userOptions?.timeout ?? 2000,
    keys: userOptions?.keys ?? {},
  });

  useEffect(() => {
    const { current: options } = optionsRef;

    const routeChangeListenerList: Array<() => void> = [];

    function handleRouteChangeComplete() {
      routeChangeListenerList.forEach((listener) => listener());
    }

    function initTrackers(): void {
      const settingsPromise: Promise<Partial<
        AnalyticsSettingsType
      >> = options.useBackend
        ? getAnalyticsSettings().then((response) => response.data)
        : Promise.resolve({});

      settingsPromise
        .then((settings) => {
          const keys: Partial<AnalyticsSettingsType> = {
            ...settings,
            ...options.keys,
          };

          if (keys.googleTagManagerId) {
            TagManager.initialize({
              gtmId: keys.googleTagManagerId,
            });
          }

          if (keys.googleAnalyticsId) {
            googleAnalytics.init(keys.googleAnalyticsId);
            googleAnalytics.trackPageView();

            routeChangeListenerList.push(() => googleAnalytics.trackPageView());
          }

          if (keys.yandexCounterId) {
            yandexMetrika.init(keys.yandexCounterId);
            yandexMetrika.trackPageView();

            routeChangeListenerList.push(() => yandexMetrika.trackPageView());
          }

          if (keys.facebookPixelId) {
            facebookPixel.init(keys.facebookPixelId);
            facebookPixel.trackPageView();

            routeChangeListenerList.push(() => facebookPixel.trackPageView());
          }
        })
        .catch(() => {
          console.error('Analytics initialization has been failed!');
        });
    }

    setTimeout(initTrackers, options.timeout);

    Router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);
}

export default useAnalytics;
