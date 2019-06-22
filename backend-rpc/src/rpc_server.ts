import * as amqp from 'amqplib/callback_api';
import { CoreVerticle, IRpcServer } from 'backend-base/lib/index'
import * as events from 'events';

export abstract class RpcServer extends CoreVerticle implements IRpcServer {
  protected readonly processTimeOut: number;

  private readonly queue: string;

  private readonly server: string;
  
  /**
   *
   */
  public constructor(config: any, name: string, protected globalEvents: events, extraConfigKeys?: string[]) {
    super(config, name, globalEvents, extraConfigKeys ? extraConfigKeys : []);
    this.queue = this.config.queue;
    this.server = this.config.server;
    this.processTimeOut = this.config.processTimeOut;
    this.onInit();
  }

  public onMessage(message: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  protected onInit(): Promise<number>{
    return new Promise((success, failure) => {
      amqp.connect(this.server, (error0, connection) => {
        if (error0) {
          failure(1);
        }
        connection.createChannel((error1, channel) => {
          if (error1) {
            failure(2);
          }
          channel.assertQueue(this.queue, {
            durable: false,
          });
  
          channel.prefetch(1);
          channel.consume(this.queue, async (msg: any) => {
            this.onMessage(msg).then(onSuccess => {
              channel.sendToQueue(msg.properties.replyTo, Buffer.from("0" + onSuccess), {
                correlationId: msg.properties.correlationId,
              });
            }).catch(onErr => {
              channel.sendToQueue(msg.properties.replyTo, Buffer.from("-1" + onErr), {
                correlationId: msg.properties.correlationId,
              });
            }).finally(() => {
              channel.ack(msg);
            });
          });
        });
      });
    });
  }
}
