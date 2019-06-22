import * as amqp from 'amqplib/callback_api';
import * as events from 'events';
import { RpcClient } from './rpc_client';


export class RabbitRpcClient extends RpcClient {

    private uuidv5 = require('uuid/v5');

    constructor(config: any, globalEvents: events) {
        super(config, "RabbitRpcClient", globalEvents);
    }

    public sendMessage(message: string): Promise<string> {
        return new Promise((success, fail) => {
            this.connection.createChannel((error1: any, channel: amqp.Channel) => {
                if (error1) {
                  throw error1;
                }
                channel.assertQueue('', {
                  exclusive: true
                }, (error2, q) => {
                  if (error2) {
                    throw error2;
                  }
                  const correlationId = this.uuidv5.DNS;

                  let timeout = setTimeout(() => {
                    this.info('timeout');
                    channel.close(cb => {
                        this.info('close chanel')
                    })
                    fail('time out');
                  }, 1000*10)
                    
                  this.info(`send request to: ${correlationId}, msg: ${message}`);

                  channel.consume(q.queue, (msg) => {
                    clearTimeout(timeout);
                    if(!msg) {
                        throw new Error('Something bad happened');
                    }
                    if (msg.properties.correlationId === correlationId) {
                        channel.ack(msg as amqp.Message);
                        success(msg.content.toString());
                    }
                  }, {
                    noAck: true
                  });

                  channel.sendToQueue(this.queue,
                    Buffer.from(message),{ 
                      correlationId: `${correlationId}`, 
                      replyTo: q.queue });
                });
              });
        })
    }

    protected onEvent(event: string, globalEvents: events): void {
        throw new Error("Method not implemented.");
    }
}