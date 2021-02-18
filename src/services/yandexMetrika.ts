import { canUseDOM } from '@tager/web-core';

interface YmFunction {
  (counterId: string, event: string, ...args: Array<unknown>): void;
  a: Array<IArguments>;
  l: number;
}

declare global {
  interface Window {
    ym?: YmFunction;
  }
}

interface YandexMetrikaTrackerType {
  init(options: {
    accurateTrackBounce?: boolean;
    childIframe?: boolean;
    clickmap?: boolean;
    defer?: boolean;
    ecommerce?: boolean | string | Array<any>;
    params?: object | Array<any>;
    userParams?: object;
    trackHash?: boolean;
    trackLinks?: boolean;
    trustedDomains?: Array<string>;
    type?: number;
    webvisor?: boolean;
    triggerEvent?: boolean;
  }): void;

  addFileExtension(extensions: string | Array<string>): void;
  extLink(
    url: string,
    options?: {
      callback?: Function;
      ctx?: object;
      params?: { order_price?: number; currency: string };
      title?: string;
    }
  ): void;
  file(
    url: string,
    options?: {
      callback?: Function;
      ctx?: object;
      params?: { order_price?: number; currency: string };
      referer?: string;
      title?: string;
    }
  ): void;
  getClientID(callback: (clientId: string) => void): void;
  hit(
    url: string,
    options?: {
      callback?: Function;
      ctx?: object;
      params?: { order_price?: number; currency: string };
      referer?: string;
      title?: string;
    }
  ): void;
  notBounce(options?: { callback?: Function; ctx?: object }): void;
  params(parameters: object | Array<any>): void;
  reachGoal(
    target: string,
    params?: object,
    callback?: Function,
    ctx?: object
  ): void;
  replacePhones(): void;
  setUserID(userId: string): void;
  userParams(parameters: Record<string, any>): void;
}

function getYmFunction(): YmFunction {
  if (canUseDOM() && typeof window.ym === 'function') return window.ym;

  const dataLayer: Array<IArguments> = [];

  function ym() {
    dataLayer.push(arguments);
  }

  ym.a = dataLayer;
  ym.l = new Date().valueOf();

  if (canUseDOM()) {
    window.ym = ym;
  }

  return ym;
}

/**
 * Reference:
 * {@link https://yandex.ru/support/metrica/code/counter-initialize.html}
 */
function loadYandexMetrikaScript(): void {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.body.appendChild(script);
}

function createYandexMetrikaTracker(
  counterId: string
): YandexMetrikaTrackerType {
  const ym = getYmFunction();

  return {
    init(...args) {
      ym(counterId, 'init', ...args);
    },
    addFileExtension(...args) {
      ym(counterId, 'addFileExtension', ...args);
    },
    extLink(...args) {
      ym(counterId, 'extLink', ...args);
    },
    file(...args) {
      ym(counterId, 'file', ...args);
    },
    getClientID(...args) {
      ym(counterId, 'getClientID', ...args);
    },
    hit(...args) {
      ym(counterId, 'hit', ...args);
    },
    notBounce(...args) {
      ym(counterId, 'notBounce', ...args);
    },
    params(...args) {
      ym(counterId, 'params', ...args);
    },
    reachGoal(...args) {
      ym(counterId, 'reachGoal', ...args);
    },
    replacePhones(...args) {
      ym(counterId, 'replacePhones', ...args);
    },
    setUserID(...args) {
      ym(counterId, 'setUserID', ...args);
    },
    userParams(...args) {
      ym(counterId, 'userParams', ...args);
    },
  };
}

/**
 * Reference: Yandex.Metrika Javascript API
 * https://yandex.ru/support/metrica/objects/method-reference.html
 */
class YandexMetrika {
  private counterId: string;
  private isInitialized: boolean;
  private tracker: YandexMetrikaTrackerType;

  constructor() {
    this.counterId = '';
    this.isInitialized = false;
    this.tracker = createYandexMetrikaTracker(this.counterId);
  }

  getTracker(): YandexMetrikaTrackerType {
    return this.tracker;
  }

  init(counterId: string) {
    if (this.isInitialized || !canUseDOM()) return;

    this.counterId = counterId;
    this.tracker = createYandexMetrikaTracker(this.counterId);

    loadYandexMetrikaScript();

    this.isInitialized = true;

    this.tracker.init({
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      defer: true,
    });
  }

  trackPageView() {
    this.tracker.hit(window.location.href, {
      referer: document.referrer,
      title: document.title,
    });
  }
}

const yandexMetrika = new YandexMetrika();

export default yandexMetrika;
