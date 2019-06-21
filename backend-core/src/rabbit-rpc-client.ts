import * as amqp from 'amqplib/callback_api';
import * as events from 'events';
import { RpcClient } from '../../backend-rpc/lib/index';


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
                  this.info(`send request to: ${correlationId}, msg: ${message}`);

                  channel.consume(q.queue, (msg) => {
                    if(!msg) {
                        throw new Error('Something bad happened');
                    }
                    if (msg.properties.correlationId === correlationId) {
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