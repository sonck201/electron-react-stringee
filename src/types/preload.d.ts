/* eslint-disable max-classes-per-file */
declare global {
  interface StringeeUtil {
    isWebRTCSupported(): boolean;
    getActiveClientId(): null | string;
    getIOSVersion(): boolean | string;
    version(): { version: string; build: string };
  }

  class StringeeClient {
    constructor(serverAddresses?: string[]);
    connect(accessToken: string): void;
    disconnect(): void;
    sendCustomMessage(userId: string, data: any, callback: () => void): void;
    on(event: string, cb: (res: any) => void): void;
  }

  class StringeeCall {
    public fromNumber: string;

    constructor(
      client: StringeeClient,
      fromNumber: string,
      toNumber: string,
      isVideoCall: boolean
    );

    on(event: string, cb: (res: any) => void): void;
    makeCall(cb: (res: any) => void): void;
    answer(cb: (res: any) => void): void;
    reject(cb: (res: any) => void): void;
    ringing(cb: (res: any) => void): void;
    hangup(cb: (res: any) => void): void;
  }

  class StringeeCall2 extends StringeeCall {}

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
