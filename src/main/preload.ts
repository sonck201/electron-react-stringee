import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  systemPreferences,
} from 'electron';
import { v4 as uuidv4 } from 'uuid';

import { getAccessToken } from '../libs/Stringee';

const userId = uuidv4();

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return undefined;
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
    versions() {
      return process.versions;
    },
    userId,
  },
  store: {
    get<T extends string | number>(val: T): T {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property: string, val: string | number) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
  stringeeEnv: {
    accessToken: getAccessToken(userId),
  },
  isMediaAccessGranted:
    systemPreferences.getMediaAccessStatus('camera') === 'granted' &&
    systemPreferences.getMediaAccessStatus('microphone') === 'granted',
});
