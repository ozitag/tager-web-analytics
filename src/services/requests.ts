import { request, ResponseBody } from '@tager/web-core';

import { AnalyticsSettingsType } from '../typings/model';

export function getAnalyticsSettings(): Promise<
  ResponseBody<AnalyticsSettingsType>
> {
  return request.get({ path: '/tager/seo/services' });
}
