/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Dispatch, SetStateAction } from 'react';

import type {
  StringeeAuthenResponse,
  StringeeSignalingState,
} from 'types/Stringee';

export default class StringeeClientUtil {
  public static readonly SERVER_ADDRS = [
    'wss://v1.stringee.com:6899/',
    'wss://v2.stringee.com:6899/',
  ];

  private userId: string = '...';

  private stringeeClient: null | StringeeClient = null;

  public setUserId: null | Dispatch<SetStateAction<string>> = null;

  public setMsgAlert: null | Dispatch<SetStateAction<string>> = null;

  public setLog: null | Dispatch<SetStateAction<string>> = null;

  set client(client: StringeeClient) {
    this.stringeeClient = client;
  }

  get client(): StringeeClient {
    if (!this.stringeeClient) {
      throw new Error('Not set StringeClient for this instance');
    }

    return this.stringeeClient;
  }

  constructor(userId: string) {
    this.userId = userId;
  }

  public static getInstance(client?: StringeeClient, userId = '') {
    const stringeeClientInstance = new StringeeClientUtil(userId);

    if (client && client instanceof StringeeClient) {
      stringeeClientInstance.client = client;
    } else {
      stringeeClientInstance.client = new StringeeClient();
    }

    stringeeClientInstance.connect(window.electron.stringeeEnv.accessToken);

    return stringeeClientInstance;
  }

  public static isWebRTCSupported(): boolean {
    console.log(
      `StringeeUtil.isWebRTCSupported: ${window.StringeeUtil.isWebRTCSupported()}`
    );

    return window.StringeeUtil.isWebRTCSupported();
  }

  public connect(accessToken: string) {
    this.client.connect(accessToken);
  }

  public settingClientEvents(): void {
    this.client.on('connect', () => {
      console.log('++++++++++++++ connected');
      // this.setMsgAlert!('Connected');
    });

    this.client.on('authen', (res: StringeeAuthenResponse) => {
      console.log('authen', res);
      this.setUserId!(res.userId);
      // this.setLog!(JSON.stringify(res));
    });

    this.client.on('disconnect', () => {
      console.log('++++++++++++++ disconnected');
      this.setMsgAlert!('Disconnected');
    });

    this.client.on('requestnewtoken', () => {
      console.log('++++++++++++++ requestnewtoken+++++++++');
      this.setMsgAlert!('Request new token');
    });

    this.client.on('incomingcall', (incomingCall: StringeeCall) => {
      console.log('incomingcall', incomingCall);

      this.settingCallEvents(incomingCall);

      // eslint-disable-next-line no-restricted-globals,no-alert
      const answer: boolean = confirm(
        `Incoming call from: ${incomingCall.fromNumber}, do you want to answer?`
      );
      if (answer) {
        incomingCall.answer((res) => {
          console.log('incomingcall :: answer res', res);
        });
      } else {
        incomingCall.reject((res) => {
          console.log('incomingcall :: reject res', res);
        });
      }
    });
  }

  public createCall(toNumber: string): StringeeCall {
    const call = new StringeeCall(this.client, this.userId, toNumber, true);

    this.settingCallEvents(call);

    return call;
  }

  public settingCallEvents(call: StringeeCall) {
    call.on('addlocalstream', (stream) => {
      // reset srcObject to work around minor bugs in Chrome and Edge.
      console.log('addlocalstream', stream);
      const localVideo =
        document.querySelector<HTMLVideoElement>('#localVideo');
      localVideo!.srcObject = null;
      localVideo!.srcObject = stream;
    });

    call.on('addremotestream', (stream) => {
      console.log('addremotestream', stream);
      const remoteVideo =
        document.querySelector<HTMLVideoElement>('#remoteVideo');
      remoteVideo!.srcObject = null;
      remoteVideo!.srcObject = stream;
    });

    call.on('error', (info) => {
      console.log(`on error: ${JSON.stringify(info)}`);
      this.setMsgAlert!(`Error: ${JSON.stringify(info)}`);
    });

    call.on('signalingstate', (state: StringeeSignalingState) => {
      console.log('signalingstate ', state);
    });

    call.on('mediastate', (state) => {
      console.log('mediastate ', state);
    });

    call.on('info', (info) => {
      console.log('++++info ', info);
    });

    call.on('otherdevice', (res) => {
      console.log('otherdevice ', res);
      if (
        (res.type === 'CALL_STATE' && res.code >= 200) ||
        res.type === 'CALL_END'
      ) {
        console.log(`$('#incoming-call-div').hide(); && callEnded();`);
      }
    });
  }
}
