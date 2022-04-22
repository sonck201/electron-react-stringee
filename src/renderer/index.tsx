import { createRoot } from 'react-dom/client';

import App from './App';
import './App.css';
import '../../assets/js/stringee-web-sdk.min';

const container = document.getElementById('root');
let root;
if (container) {
  root = createRoot(container);
}

if (root) {
  root.render(<App />);
}

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.myPing();
