import { IRpcConfig } from './rpc_config';

export abstract class RpcClient {
  private readonly queue: string;

  private readonly server: string;
  /**
   *
   */
  protected constructor(config: IRpcConfig) {
    this.queue = config.queue;
    this.server = config.server;
  }
}
