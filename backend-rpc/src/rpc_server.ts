import * as amqp from 'amqplib/callback_api';
import { IRpcConfig } from './rpc_config';
export abstract class RpcServer {
  private readonly queue: string;

  private readonly server: string;

  private readonly name: string;
  /**
   *
   */
  protected constructor(config: IRpcConfig) {
    this.queue = config.queue;
    this.server = config.server;
    this.name = config.name;
    this.onInit();
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
          const result = await this.processRequest(msg);
          channel.sendToQueue(msg.properties.replyTo, Buffer.from(result + ''), {
            correlationId: msg.properties.correlationId,
          });
          channel.ack(msg);
        });
      });
    });
  }

  protected abstract async processRequest(req: any): Promise<any>;
}
