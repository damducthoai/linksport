import { Snowflake } from 'backend-base';
import { RpcServer } from "backend-rpc";
import * as events from 'events';
export class RegisterHandler extends RpcServer {

    private idGenerator: Snowflake;

    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "RegisterHandler", globalEvents, extraConfigKeys);
        this.idGenerator = new Snowflake();
    }
    public onMessage(message: string): Promise<string>{
        return new Promise((success, error) => {
            setTimeout(() => {
                success('message processed: ' + this.idGenerator.generate());
            }, this.processTimeOut)
        });
    }
    protected onEvent(event: string, globalEvents: events): void {
        throw new Error("Method not implemented.");
    }
}