export interface StringeeAuthenResponse {
  r: number;
  clients: StringeeAuthenResponseClient[];
  requestId: number;
  connectionId: number;
  ice_servers: StringeeAuthenResponseIceServer[];
  message: string;
  ping_after_ms: number;
  userId: string;
  projectId: number;
}

export interface StringeeAuthenResponseClient {
  browserId: string;
  clientId: string;
  deviceName: string;
  platform: number;
}

export interface StringeeAuthenResponseIceServer {
  urls: string;
  credential: string;
  username: string;
}
