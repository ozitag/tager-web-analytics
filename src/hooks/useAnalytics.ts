import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { Router } from 'next/router';

import { getAnalyticsSettings } from '../services/requests';
import googleAnalytics from '../services/googleAnalytics';
import yandexMetrika from '../services/yandexMetrika';
import facebookPixel from '../services/facebookPixel';

function useAnalytics() {
  useEffect(() => {
    getAnalyticsSettings()
      .then((response) => {
        const settings = response.data;

        if (settings.googleTagManagerId) {
          TagManager.initialize({
            gtmId: settings.googleTagManagerId,
          });
        }

        const routeChangeListenerList: Array<() => void> = [];

        if (settings.googleAnalyticsId) {
          googleAnalytics.init(settings.googleAnalyticsId);
          googleAnalytics.trackPageView();

          routeChangeListenerList.push(() => googleAnalytics.trackPageView());
        }

        if (settings.yandexCounterId) {
          yandexMetrika.init(settings.yandexCounterId);
          yandexMetrika.trackPageView();

          routeChangeListenerList.push(() => yandexMetrika.trackPageView());
        }

        if (settings.facebookPixelId) {
          facebookPixel.init(settings.facebookPixelId);
          facebookPixel.trackPageView();

          routeChangeListenerList.push(() => facebookPixel.trackPageView());
        }

        function handleRouteChangeComplete() {
          routeChangeListenerList.forEach((listener) => listener());
        }

        Router.events.on('routeChangeComplete', handleRouteChangeComplete);

        return () => {
          Router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };
      })
      .catch(() => {
        console.error('Analytics initialization has been failed!');
      });
  }, []);
}

export default useAnalytics;
