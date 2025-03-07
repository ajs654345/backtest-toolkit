
export interface IpcRenderer {
  send(channel: string, ...args: any[]): void;
  invoke(channel: string, ...args: any[]): Promise<any>;
}

declare global {
  interface Window {
    electron: {
      send: IpcRenderer['send'];
      invoke: IpcRenderer['invoke'];
    };
  }
}
