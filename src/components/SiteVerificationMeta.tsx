import React from 'react';

import { Nullable } from '@tager/web-core';

type Props = {
  google?: Nullable<string>;
  yandex?: Nullable<string>;
};

function SiteVerificationMeta({ google, yandex }: Props) {
  const googleCode =
    google || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_CODE;

  const yandexCode =
    yandex || process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION_CODE;
  return (
    <>
      {googleCode ? (
        <meta name="google-site-verification" content={googleCode} />
      ) : null}

      {yandexCode ? (
        <meta name="yandex-verification" content={yandexCode} />
      ) : null}
    </>
  );
}

export default SiteVerificationMeta;
