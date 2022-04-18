import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import icon from '../../assets/icon.svg';

const Hello = () => {
  const versions = window.electron.ipcRenderer.versions();

  console.log(
    `StringeeUtil.isWebRTCSupported: ${window.StringeeUtil.isWebRTCSupported()}`
  );

  const client = new window.StringeeClient();
  client.connect(window.electron.stringeeEnv.accessToken);

  client.on('connect', () => {
    console.log('connected');
  });

  client.on('authen', (res) => {
    console.log('authen', res);
    // $('#loggedUserId').html(res.userId);
  });

  client.on('disconnect', () => {
    console.log('disconnected');
  });

  client.on('requestnewtoken', () => {
    console.log(
      '++++++++++++++ requestnewtoken; please get new access_token from YourServer and call client.connect(new_access_token)+++++++++'
    );
    // please get new access_token from YourServer and call:
    // client.connect(new_access_token);
  });

  return (
    <>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>

      <h1 className="font-bold text-3xl text-center my-10">
        Electron - React - Stringee
      </h1>

      <div className="flex items-center justify-center">
        <button type="button" className="m-3 btn-primary">
          Create room
        </button>
        <button type="button" className="m-3 btn-secondary">
          Join room
        </button>
      </div>

      <div className="text-center mt-5">
        User ID: {window.electron.ipcRenderer.userId}
      </div>

      <div className="absolute bottom-0 left-0 w-full text-center">
        <span>
          We are using Node.js::
          <span id="node-version">{versions.node}</span>
        </span>
        <span className="ml-5">
          Chromium::
          <span id="chrome-version">{versions.chrome}</span>
        </span>
        <span className="ml-5">
          Electron::
          <span id="electron-version">{versions.electron}</span>
        </span>
      </div>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
