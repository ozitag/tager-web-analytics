import { appendScriptCodeToBody, canUseDOM, Nullable } from '@tager/web-core';

const SCRIPT_CODE = `
    !function(e){if(!window.pintrk){window.pintrk = function () {
    window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
    n=window.pintrk;n.queue=[],n.version="3.0";var
    t=document.createElement("script");t.async=!0,t.src=e;var
    r=document.getElementsByTagName("script")[0];
    r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
`;

type PinterestInstance = (
  category: string,
  event?: string,
  params?: object
) => void;

declare global {
  interface Window {
    pintrk: PinterestInstance;
  }
}

class Pinterest {
  pinterestId: string;

  constructor() {
    this.pinterestId = '';
  }

  getTracker(): Nullable<PinterestInstance> {
    if (this.pinterestId && canUseDOM() && window.pintrk) {
      return window.pintrk;
    }

    return null;
  }

  init(pinterestId: string) {
    this.pinterestId = pinterestId;

    appendScriptCodeToBody(SCRIPT_CODE);

    const tracker = this.getTracker();
    if (!tracker) return;

    tracker('load', this.pinterestId);
  }

  trackPageView() {
    const tracker = this.getTracker();
    if (!tracker) return;

    tracker('page');
  }

  track(event: string, params?: object) {
    const tracker = this.getTracker();
    if (!tracker) return;

    tracker('track', event, params);
  }
}

const pinterest = new Pinterest();

export default pinterest;
