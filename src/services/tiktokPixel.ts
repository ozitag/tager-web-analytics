import { appendScriptCodeToBody, canUseDOM, Nullable } from '@tager/web-core';

const SCRIPT_CODE = `
    !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once",
        "ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){
        t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)
        ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)
        ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
        var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
        var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
    }(window, document, 'ttq');
`;

interface TiktokPixelInterface {
  load(code: string): void;

  page(): void;

  track(event: string): void;
}

declare global {
  interface Window {
    ttq?: TiktokPixelInterface;
  }
}

class TiktokPixel {
  pixelId: string;

  constructor() {
    this.pixelId = '';
  }

  getTracker(): Nullable<TiktokPixelInterface> {
    if (this.pixelId && canUseDOM() && window.ttq) {
      return window.ttq;
    }

    return null;
  }

  init(pixelId: string) {
    this.pixelId = pixelId;

    appendScriptCodeToBody(SCRIPT_CODE);

    const tracker = this.getTracker();
    if (!tracker) return;

    tracker.load(this.pixelId);
  }

  trackPageView() {
    const tracker = this.getTracker();
    if (!tracker) return;

    tracker.page();
  }
}

const tiktokPixel = new TiktokPixel();

export default tiktokPixel;
