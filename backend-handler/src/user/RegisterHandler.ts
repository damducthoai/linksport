import * as amqp from 'amqplib/callback_api';
import { Snowflake, IRequestModel} from 'backend-base';
import { IBackendRegister } from 'backend-base';
import { RpcServer } from "backend-rpc";
import * as events from 'events';
import { RegisterTask } from './task/register_task';

export class RegisterHandler extends RpcServer {

    private readonly insertQuery = 'insert into account_info(id, username, password, status, create_at) values (shard_register.id_generator(),$1,$2,$3,CURRENT_TIMESTAMP) returning id';
    private readonly idGenerator: Snowflake;
    private readonly saltRounds: number;
    private readonly exchange?: string;
    private readonly task: RegisterTask;

    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "RegisterHandler", globalEvents, extraConfigKeys);
        this.idGenerator = new Snowflake();
        this.saltRounds = this.config.saltRounds;
        if(this.config.exchange) {
            this.exchange = this.config.exchange;
        }
        this.task = new RegisterTask(config);
    }
    public onMessage(message: string): Promise<string>{
        this.info(`receive request: ${message}`)
        const curId = this.idGenerator.generate();
        this.info(`request id: ${curId}`);
        const data : IRequestModel = JSON.parse(message);
        return new Promise(async (success, fail) => {
            const timeOut = setTimeout(() => {
                fail(this.errorCodes.timeout);
            }, this.processTimeOut)

            this.task.run(data).then(res => {
                const registerData = res.data as IBackendRegister;
                registerData.password = "****";
                success((registerData.id || "****").toString());
                clearTimeout(timeOut);
                if(this.exchange){
                    const channel = (this.channel as amqp.Channel);
                    channel.publish(this.exchange,'', Buffer.from(registerData.toString()));
                }
            }).catch(err => {
                fail(err);
                clearTimeout(timeOut);
            })
        });
    }
    protected onEvent(event: string, globalEvents: events): void {
        throw new Error("Method not implemented.");
    }
}