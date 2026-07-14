/// <reference types="vite/client" />

declare global {
    interface Window {
        api: {
            platform: string;
        };
    }
}

export {};
