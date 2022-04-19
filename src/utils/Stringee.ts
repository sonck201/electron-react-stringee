// type StringeeA = window.
// const [StringeeClient] = Window;

export default class StringeeClientUtil {
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

  public settingClientEvents(): void {
    this.client.on('connect', () => {
      console.log('connected');
    });

    this.client.on('disconnect', () => {
      console.log('disconnected');
    });

    this.client.on('requestnewtoken', () => {
      console.log(
        '++++++++++++++ requestnewtoken; please get new access_token from YourServer and call client.connect(new_access_token)+++++++++'
      );
      // please get new access_token from YourServer and call:
      // client.connect(new_access_token);
    });

    this.client.on('incomingcall2', (incomingCall: StringeeCall2) => {
      console.log('incomingcall2', incomingCall);
      const call = incomingCall;
      StringeeClientUtil.settingCallEvents(incomingCall);

      // eslint-disable-next-line no-restricted-globals
      const answer = confirm(
        `Incoming call from: ${incomingCall.fromNumber}, do you want to answer?`
      );
      if (answer) {
        call.answer((res) => {
          console.log('answer res', res);
        });
      } else {
        call.reject((res) => {
          console.log('reject res', res);
        });
      }
    });
  }

  public static settingCallEvents(call: StringeeCall2) {
    call.on('addlocalstream', (stream) => {
      console.log(
        'addlocalstream, not processing with this event => process in event: addlocaltrack'
      );
    });

    call.on('addlocaltrack', (localtrack1) => {
      console.log('addlocaltrack', localtrack1);

      const element = localtrack1.attach();
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

    call.on('signalingstate', (state) => {
      console.log('signalingstate ', state);
      if (state.code === 6) {
        console.log(`$('#incomingcallBox').hide();`);
      }

      if (state.code === 6) {
        console.log(`setCallStatus('Ended');`);
        console.log(`onstop();`);
      } else if (state.code === 3) {
        console.log(`setCallStatus('Answered');`);
        console.log(`test_stats();`);
      } else if (state.code === 5) {
        console.log(`setCallStatus('User busy');`);
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
