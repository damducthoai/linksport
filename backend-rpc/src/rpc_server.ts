import * as amqp from 'amqplib/callback_api';
import { CoreVerticle, IRpcServer } from 'backend-base/lib/index'
import * as events from 'events';

export abstract class RpcServer extends CoreVerticle implements IRpcServer {
  protected readonly processTimeOut: number;

  protected channel: any;

  private readonly queue: string;

  private readonly server: string;
  
  private uuidv5 = require('uuid/v5');

  private readonly tag: string;

  
  /**
   *
   */
  public constructor(config: any, name: string, protected globalEvents: events, extraConfigKeys?: string[]) {
    super(config, name, globalEvents, extraConfigKeys ? extraConfigKeys : []);
    this.queue = this.config.queue;
    this.server = this.config.server;
    this.processTimeOut = this.config.processTimeOut;
    this.tag = `${this.name}_${this.uuidv5.DNS}`;
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
          this.channel = channel;
          if (error1) {
            failure(2);
          }  
          channel.prefetch(1);
          channel.consume(this.queue, async (msg: any) => {
            this.onMessage(msg.content.toString()).then(onSuccess => {
              channel.sendToQueue(msg.properties.replyTo, Buffer.from("0|" + onSuccess), {
                correlationId: msg.properties.correlationId,
              });
              channel.ack(msg);
            }).catch(onErr => {
              channel.sendToQueue(msg.properties.replyTo, Buffer.from("-1|" + onErr), {
                correlationId: msg.properties.correlationId,
              });
              channel.ack(msg);
            })
          }, {
            consumerTag : this.tag
          });
          success(0)
        });
      });
    });
  }
  protected afterInit(): Promise<number>{
    return new Promise((success, fail) => {
      this.info(`handler for ${this.queue}`);
      success(1);
    });
  }
}
