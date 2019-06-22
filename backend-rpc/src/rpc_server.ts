import * as amqp from 'amqplib/callback_api';
import { IRpcServer } from 'backend-base/lib/index'
export abstract class RpcServer implements IRpcServer {
  
  private readonly queue: string;

  private readonly server: string;

  private readonly name: string;

  private readonly processTimeOut: number;
  /**
   *
   */
  protected constructor(config: any) {
    this.queue = config.queue;
    this.server = config.server;
    this.name = config.name;
    this.processTimeOut = config.processTimeOut;
    this.onInit();
  }

  public onMessage(message: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  protected onInit() {
    amqp.connect(this.server, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
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
  }
}
