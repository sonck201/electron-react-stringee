declare global {
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
      };
      store: {
        get<T extends string | number>(val: T): T;
        set: (key: string, val: string | number) => void;
        // any other methods you've defined...
      };
    };
  }
}

export {};
