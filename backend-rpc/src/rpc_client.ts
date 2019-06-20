import { CoreVerticle, IRpcClient } from 'backend-base/lib/index'

export abstract class RpcClient extends CoreVerticle implements IRpcClient {

  private readonly queue: string;

  private readonly server: string;

  constructor(config: any, name: string) {
    super(config, name);
    this.queue = this.config.this.queue;
    this.server = this.config.server;
  }

  public sendMessage(message: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  
}
