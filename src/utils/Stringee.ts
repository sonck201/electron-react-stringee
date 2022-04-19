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

  public init(): void {
    this.client.on('connect', this.onConnectHandler);

    // this.client.on('authen', this.onAuthenHandler);

    this.client.on('disconnect', this.onDisconnectHandler);

    this.client.on('requestnewtoken', this.onRequestnewtokenHandler);
  }

  // eslint-disable-next-line class-methods-use-this
  private onConnectHandler() {
    console.log('connected');
  }

  // eslint-disable-next-line class-methods-use-this
  // private onAuthenHandler(res: any) {
  // console.log('authen', res);
  // setUserId(res.userId);
  // }

  // eslint-disable-next-line class-methods-use-this
  private onDisconnectHandler() {
    console.log('disconnected');
  }

  // eslint-disable-next-line class-methods-use-this
  private onRequestnewtokenHandler() {
    console.log(
      '++++++++++++++ requestnewtoken; please get new access_token from YourServer and call client.connect(new_access_token)+++++++++'
    );
    // please get new access_token from YourServer and call:
    // client.connect(new_access_token);
  }
}
