/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
    interface Platform {
      env?: {
        API_URL?: string;
        API_KEY?: string;
      };
    }
  }
}

export {};
