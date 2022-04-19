import { FormEvent, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import icon from '../../assets/icon.svg';
import type { StringeeAuthenResponse } from '../types/Stringee';
import StringeeClientUtil from '../utils/Stringee';

const Hello = () => {
  const [msgAlert, setMsgAlert] = useState('');
  const [userId, setUserId] = useState(window.electron.ipcRenderer.userId);

  const remoteUserId = useRef<HTMLInputElement>(null);

  const versions = window.electron.ipcRenderer.versions();

  if (!StringeeClientUtil.isWebRTCSupported()) {
    return <>Your device does not support WebRTC</>;
  }

  const stringeeClient = StringeeClientUtil.getInstance();
  stringeeClient.init();
  stringeeClient.client.on('authen', (res: StringeeAuthenResponse) => {
    console.log('authen', res);
    setUserId(res.userId);
  });

  const onCallHandler = (formEvent: FormEvent) => {
    formEvent.preventDefault();

    setMsgAlert('');

    if (!remoteUserId) {
      setMsgAlert('Please input remote UUID for calling');
    }

    const remoteUserUuid = String(remoteUserId?.current?.value);

    if (remoteUserUuid.length !== 36) {
      setMsgAlert(`Invalid UUID - ${remoteUserUuid.length} chars length`);
    }

    if (remoteUserUuid === userId) {
      setMsgAlert('Remote UUID can not be local UUID');
    }

    remoteUserId?.current?.focus();

    setMsgAlert('Implementing call to remote ID');
  };

  return (
    <>
      <div className="Hello">
        <img width="100px" alt="icon" src={icon} />
      </div>
      <h1 className="font-bold text-3xl text-center my-10">
        Electron - React - Stringee
      </h1>
      {msgAlert && (
        <div className="text-center shadow bg-slate-600 text-red-400">
          {msgAlert}
        </div>
      )}
      <form
        className="flex items-center justify-center"
        onSubmit={onCallHandler}
      >
        <input
          className="form-control required:border-red-500"
          placeholder="Input UUID for calling"
          ref={remoteUserId}
          type="text"
          required
        />
        <button type="submit" className="m-3 btn-primary w-20">
          Call
        </button>
      </form>
      <div className="text-center mt-5">User ID: {userId}</div>
      <table className="w-full">
        <thead>
          <tr>
            <th>Local video</th>
            <th>Remote video</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div id="local_videos" className="h-[200px] w-[200px]" />
            </td>
            <td>
              <div id="remote_videos" className="h-[200px] w-[200px]" />
            </td>
          </tr>
        </tbody>
      </table>
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
