import {canUseDOM} from '@tager/web-core';

function loadGoogleOptimizeScript(optContainerId: string): void {
    const script = document.createElement('script');
    script.src = 'https://www.googleoptimize.com/optimize.js?id=' + optContainerId;
    document.body.appendChild(script);
}

class GoogleOptimize {
    private isInitialized: boolean;

    constructor() {
        this.isInitialized = false;
    }

    init(optContainerId: string) {
        if (this.isInitialized || !canUseDOM()) return;

        loadGoogleOptimizeScript(optContainerId);

        this.isInitialized = true;
    }
}

const googleOptimize = new GoogleOptimize();

export default googleOptimize;