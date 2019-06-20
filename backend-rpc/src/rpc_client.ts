import * as amqp from 'amqplib/callback_api';
import { CoreVerticle, IRpcClient } from 'backend-base/lib/index'

export abstract class RpcClient extends CoreVerticle implements IRpcClient {

  private readonly queue: string;

  private readonly server: string;

  private clientChanel : any;

  public genUUID = () => {
    return Math.random().toString() +
      Math.random().toString() +
      Math.random().toString();
  }

  constructor(config: any, name: string) {
    super(config, name);
    this.queue = this.config.queue;
    this.server = this.config.server;
  }

  public generateUuid(): string {
    
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
  }

  public sendMessage(message: string): Promise<string> {
    this.info(`${this.name} listening at: ${this.queue}`);
          return new Promise<string>(res => {
            res("s");
        })
  }
}
