import * as amqp from 'amqplib/callback_api';
import { CoreVerticle } from 'backend-base/lib/index'
import * as events from 'events';

export abstract class RpcClient extends CoreVerticle {

  protected connection : any;

  protected readonly queue: string;

  protected readonly server: string;

  constructor(config: any, name: string, globalEvents: events) {
    super(config, name, globalEvents);
    this.queue = this.config.queue;
    this.server = this.config.server;
  }

  public abstract sendMessage(message: string): Promise<string>;

  protected onInit(){
    return new Promise<number>(res => {
      amqp.connect(this.server, (error0, connection) => {
        if (error0) {
          throw error0;
        }
        this.connection = connection;
      });
        res(0);
    })
 }
}
