import * as amqp from 'amqplib/callback_api';
import { Message } from 'amqplib/callback_api';
import * as events from 'events';
import { RpcClient } from './rpc_client';

export class RabbitRpcClient extends RpcClient {

    private timeout: number;

    constructor(config: any, globalEvents: events) {
        super(config, "RabbitRpcClient", globalEvents);
        this.timeout = this.config.timeout;
    }

    public sendMessage(message: string): Promise<string> {
      const correlationId = this.uuidv5.DNS;
      
        return new Promise((success, fail) => {
          if(!this.chanel){
            fail('chanel not available');
            return;
          }
          const channel = this.chanel as amqp.Channel;
          channel.assertQueue('', {
            durable: false,
            exclusive: true
          }, (error2, q) => {
            if (error2) {
              throw error2;
            }
            const timeout = setTimeout(() => {
              this.error(`timeout: ${this.queue} | ${correlationId} | ${message}`);
              channel.deleteQueue(q.queue);
              fail(this.errorCodes.timeout.code);
            }, this.timeout)
              
            this.info(`send request to: ${this.queue} | ${correlationId}, msg: ${message}`);
            
            channel.consume(q.queue,(msg: Message | null) => {
              clearTimeout(timeout);
              if(!msg) {
                  channel.deleteQueue(q.queue);
                  fail('no result');
                  return;
              }
              if(msg.fields.consumerTag){ // delete callback queue
                channel.cancel(msg.fields.consumerTag);
                channel.deleteQueue(q.queue);
              }
              if (msg.properties.correlationId === correlationId) {
                  msg.content.toString();
                  const rpcRawResponse =msg.content.toString();
                  const splitterIndex = rpcRawResponse.indexOf("|");
                  const responseNoFlag = rpcRawResponse.substring(splitterIndex + 1);
                  if(rpcRawResponse.startsWith("0")){
                    success(responseNoFlag);
                  } else {
                    fail(responseNoFlag);
                  }
              }
            }, {
              noAck: false
            });

            channel.sendToQueue(this.queue,
              Buffer.from(message),{ 
                correlationId: `${correlationId}`, 
                replyTo: q.queue });
          });
        })
    }

    protected afterInit(): Promise<number>{
      return new Promise((success, fail) => {
        this.info(`client for ${this.queue}`);
        success(1);
      });
    }

    protected onEvent(event: string, globalEvents: events): void {
        throw new Error("Method not implemented.");
    }
}