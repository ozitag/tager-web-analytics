import { Nullable } from '@tager/web-core';

export type AnalyticsSettingsType = {
  yandexVerification: Nullable<string>;
  googleVerification: Nullable<string>;
  googleAnalyticsId: Nullable<string>;
  googleTagManagerId: Nullable<string>;
  yandexCounterId: Nullable<string>;
  facebookPixelId: Nullable<string>;
};
