import { Nullable } from '@tager/web-core';

export interface AnalyticsSettingsType {
  yandexVerification: Nullable<string>;
  googleVerification: Nullable<string>;
  googleAnalyticsId: Nullable<string>;
  googleAnalytics4MeasurementId: Nullable<string>;
  googleTagManagerId: Nullable<string>;
  yandexCounterId: Nullable<string>;
  facebookPixelId: Nullable<string>;
}
