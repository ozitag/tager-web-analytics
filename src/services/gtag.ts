import { canUseDOM } from '@tager/web-core';

declare global {
  interface Window {
    dataLayer?: Array<IArguments>;
  }
}

function execCommand(..._args: Array<unknown>) {
  if (!canUseDOM()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

export const gtag = {
  /**
   * Reference:
   * {@link https://developers.google.com/gtagjs/reference/api#config}
   */
  config(targetId: string, configInfo: { [key: string]: unknown } = {}) {
    execCommand('config', targetId, configInfo);
  },
  /**
   * Reference:
   * {@link https://developers.google.com/gtagjs/reference/api#get}
   */
  get(target: string, fieldName: string, callback: Function) {
    execCommand('get', target, fieldName, callback);
  },
  /**
   * Reference:
   * {@link https://developers.google.com/gtagjs/reference/api#set}
   */
  set(params: { [key: string]: unknown }) {
    execCommand('set', params);
  },
  /**
   * Reference:
   * {@link https://developers.google.com/gtagjs/reference/api#event}
   */
  event(eventName: string, eventParams: { [key: string]: unknown } = {}) {
    execCommand('event', eventName, eventParams);
  },
  js(startDate: Date) {
    execCommand('js', startDate);
  },
} as const;

function loadGtagScript(measurementId: string): void {
  /**
   * Reference:
   * {@link https://developers.google.com/analytics/devguides/collection/gtagjs#install_the_global_site_tag}
   */
  const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  const script = document.createElement('script');
  script.async = true;
  script.src = scriptSrc;
  document.body.appendChild(script);
}

class GtagManager {
  private measurementId: string;
  private isInitialized: boolean;

  constructor() {
    this.measurementId = '';
    this.isInitialized = false;
  }

  public init(measurementId: string) {
    if (this.isInitialized || !canUseDOM()) return;

    this.measurementId = measurementId;

    loadGtagScript(this.measurementId);

    this.isInitialized = true;

    /**
     * I don't know why we need this command, but the example contains it
     * {@link https://developers.google.com/analytics/devguides/collection/gtagjs#install_the_global_site_tag}
     */
    gtag.js(new Date());

    gtag.config(this.measurementId);
  }
}

export const gtagManager = new GtagManager();
