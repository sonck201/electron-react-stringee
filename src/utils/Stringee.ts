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

  private static readonly CALL_STATE_INIT = 0;

  private static readonly CALL_STATE_CALLING = 1;

  private static readonly CALL_STATE_RINGING = 2;

  private static readonly CALL_STATE_ANSWERED = 3;

  private static readonly CALL_STATE_CONNECTED = 4;

  private static readonly CALL_STATE_BUSY = 5;

  private static readonly CALL_STATE_ENDED = 6;

  private stringeeClient: null | StringeeClient = null;

  set client(client: StringeeClient) {
    this.stringeeClient = client;
  }

  get client(): StringeeClient {
    if (!this.stringeeClient) {
      throw new Error('Not set StringeClient for this instance');
    }

    return this.stringeeClient;
  }

  public static getInstance(client?: StringeeClient) {
    const stringeeClientInstance = new StringeeClientUtil();

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

  public settingClientEvents(
    setUserId: Dispatch<SetStateAction<string>>,
    setMsgAlert: Dispatch<SetStateAction<string>>
  ): void {
    this.client.on('connect', () => {
      console.log('++++++++++++++ connected');
      // setMsgAlert('Connected');
    });

    this.client.on('authen', (res: StringeeAuthenResponse) => {
      console.log('authen', res);
      setUserId(res.userId);
    });

    this.client.on('disconnect', () => {
      console.log('++++++++++++++ disconnected');
      setMsgAlert('Discounted');
    });

    this.client.on('requestnewtoken', () => {
      console.log('++++++++++++++ requestnewtoken+++++++++');
      setMsgAlert('Request new token');
    });

    this.client.on('incomingcall2', (incomingCall: StringeeCall2) => {
      console.log('incomingcall2', incomingCall);
      const call = incomingCall;
      StringeeClientUtil.settingCallEvents(incomingCall, () => {});

      // eslint-disable-next-line no-restricted-globals,no-alert
      const answer: boolean = confirm(
        `Incoming call from: ${incomingCall.fromNumber}, do you want to answer?`
      );
      if (answer) {
        call.answer((res) => {
          console.log('incomingcall2 :: answer res', res);
        });
      } else {
        call.reject((res) => {
          console.log('incomingcall2 :: reject res', res);
        });
      }
    });
  }

  public static settingCallEvents(
    call: StringeeCall2,
    setMsgAlert: Dispatch<SetStateAction<string>>
  ) {
    call.on('addlocalstream', (stream) => {
      console.log(
        'addlocalstream, not processing with this event => process in event: addlocaltrack'
      );
    });

    call.on('addlocaltrack', (track) => {
      console.log('addlocaltrack', track);

      const element = track.attach();
      document
        .getElementById('local_videos')
        ?.childNodes.forEach((ele) => ele.remove());
      document.getElementById('local_videos')?.appendChild(element);
      element.style.height = '150px';
      element.style.color = 'red';
    });

    call.on('addremotetrack', (track) => {
      const element = track.attach();
      document
        .getElementById('remote_videos')
        ?.childNodes.forEach((ele) => ele.remove());
      document.getElementById('remote_videos')?.appendChild(element);
      element.style.height = '150px';
    });

    call.on('removeremotetrack', (track) => {
      track.detachAndRemove();
    });

    call.on('removelocaltrack', (track) => {
      track.detachAndRemove();
    });

    call.on('signalingstate', (state: StringeeSignalingState) => {
      console.log('signalingstate ', state);

      if (state.code === StringeeClientUtil.CALL_STATE_ENDED) {
        console.log(`$('#incomingcallBox').hide();`);
        // setMsgAlert('Ended');
        console.log(`onstop();`);
      } else if (state.code === StringeeClientUtil.CALL_STATE_ANSWERED) {
        // setMsgAlert('Answered');
        console.log(`test_stats();`);
      } else if (state.code === StringeeClientUtil.CALL_STATE_BUSY) {
        // setMsgAlert('User busy');
        console.log(`onstop();`);
      }
    });
    call.on('mediastate', (state) => {
      console.log('mediastate ', state);
    });
    call.on('otherdevice', (msg) => {
      console.log('otherdevice ', msg);
      if (msg.type === 'CALL2_STATE') {
        if (msg.code === 200 || msg.code === 486) {
          console.log(`$('#incomingcallBox').hide();`);
        }
      }
    });
    call.on('info', (info) => {
      console.log('++++info ', info);
    });

    call.answer((res) => {
      console.log('answer res', res);
    });
    call.reject((res) => {
      console.log('reject res', res);
    });

    call.hangup((res) => {
      console.log('hangup res', res);
    });
  }
}
