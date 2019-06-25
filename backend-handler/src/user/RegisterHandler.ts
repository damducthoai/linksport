import * as amqp from 'amqplib/callback_api';
import { Snowflake } from 'backend-base';
import { IBackendRegister } from 'backend-base';
import { RpcServer } from "backend-rpc";
import * as bcrypt from 'bcryptjs';
import * as events from 'events';
import { Pool } from  'pg';
import { launcher } from '../index'

export class RegisterHandler extends RpcServer {

    private readonly insertQuery = 'insert into account_info(id, username, password, status, create_at) values (shard_register.id_generator(),$1,$2,$3,CURRENT_TIMESTAMP) returning id';
    private readonly idGenerator: Snowflake;
    private readonly saltRounds: number;
    private readonly exchange?: string;

    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "RegisterHandler", globalEvents, extraConfigKeys);
        this.idGenerator = new Snowflake();
        this.saltRounds = this.config.saltRounds;
        if(this.config.exchange) {
            this.exchange = this.config.exchange;
        }
    }
    public onMessage(message: string): Promise<string>{
        this.info(`receive request: ${message}`)
        const curId = this.idGenerator.generate();
        this.info(`request id: ${curId}`);
        const data : IBackendRegister = JSON.parse(message);
        return new Promise(async (success, error) => {
            const channel = (this.channel as amqp.Channel);
            
            const timeOut = setTimeout(() => {
                error(this.errorCodes.timeout);
            }, this.processTimeOut)
            
            const pool = launcher.getPgPool() as Pool;

            const [client, password] = await Promise.all([pool.connect(), bcrypt.hash(data.password, this.saltRounds)])

            const params = [data.user, password, 0];
            
            client.query(this.insertQuery,params,(err: any, res: any) => {
                if(err){
                    error(this.errorCodes.registerFail.code)
                }
                if(res && (res.rows as []).length > 0){
                    const createdId = res.rows[0].id;
                    success(createdId);
                    if(this.exchange){
                        channel.publish(this.exchange,'', Buffer.from(JSON.stringify({
                            id: createdId,
                            user: data.user
                        })));
                        this.info(`publist msg to exchange: ${this.exchange}`)
                    }
                } else {
                    error(this.errorCodes.registerFail.code)
                }
                client.release();
                clearInterval(timeOut);
            })
        });
    }
    protected onEvent(event: string, globalEvents: events): void {
        throw new Error("Method not implemented.");
    }
}