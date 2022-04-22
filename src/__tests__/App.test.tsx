import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import '../../assets/js/stringee-web-sdk.min';

import App from '../renderer/App';

describe('App', () => {
  beforeEach(() => {
    window.electron = {
      ...window.electron,
      ipcRenderer: {
        myPing: () => {},
        on: () => () => {},
        once: () => {},
        versions: () => process.versions,
        userId: '...',
      },
    };
  });

  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
