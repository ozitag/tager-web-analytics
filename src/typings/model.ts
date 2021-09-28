import { Nullable } from '@tager/web-core';

export interface AnalyticsSettingsType {
  googleTagManagerId: Nullable<string>;
  googleAnalyticsId: Nullable<string>;
  googleAnalytics4MeasurementId: Nullable<string>;
  googleOptimizeId: Nullable<string>;
  yandexCounterId: Nullable<string>;
  facebookPixelId: Nullable<string>;
  tiktokPixelId: Nullable<string>;
  pinterestId: Nullable<string>;
  yandexVerification: Nullable<string>;
  googleVerification: Nullable<string>;
}
