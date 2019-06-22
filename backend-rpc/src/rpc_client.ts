import * as amqp from 'amqplib/callback_api';
import { CoreVerticle } from 'backend-base/lib/index'
import * as events from 'events';

export abstract class RpcClient extends CoreVerticle {

  protected connection : any;

  protected readonly queue: string;

  protected readonly server: string;

  protected  chanel: amqp.Channel | undefined;

  constructor(config: any, name: string, globalEvents: events) {
    super(config, name, globalEvents);
    this.queue = this.config.queue;
    this.server = this.config.server;
  }

  public abstract sendMessage(message: string): Promise<string>;

  protected onInit(){
    return new Promise<number>((res, reject) => {
      amqp.connect(this.server, (error0, connection) => {
        if(error0){
          reject('cannot connect to server');
          return;
        }
        this.connection = connection;
        this.connection.createChannel((error1: any, channel: amqp.Channel) => {
          if (error1) {
            reject('cannot create chanel to server');
            return;  
          }
          this.chanel = channel;
          res(0);
        })
      });
        res(-1);
    })
 }
}
