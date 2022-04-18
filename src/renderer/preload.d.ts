declare global {
  interface StringeeUtil {
    isWebRTCSupported(): boolean;
    getActiveClientId(): null | string;
    getIOSVersion(): boolean | string;
  }

  class StringeeClient {
    constructor();
    connect(accessToken: string): void;
    on(event: string, cb: (res: any) => void): void;
  }

  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        versions(): NodeJS.ProcessVersions;
        userId: string;
      };
      store: {
        get<T extends string | number>(val: T): T;
        set: (key: string, val: string | number) => void;
        // any other methods you've defined...
      };
      stringeeEnv: {
        accessToken: string;
      };
    };
    StringeeUtil: StringeeUtil;
    StringeeClient: typeof StringeeClient;
  }
}

export {};
