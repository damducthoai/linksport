import { RpcServer } from "backend-rpc";
import * as events from 'events';
export class RegisterHandler extends RpcServer {

    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "RegisterHandler", globalEvents, extraConfigKeys);
    }
    public onMessage(message: string): Promise<string>{
        return new Promise((success, error) => {
            setTimeout(() => {
                success('message processed');
            }, this.processTimeOut)
        });
    }
    protected onEvent(event: string, globalEvents: events): void {
        throw new Error("Method not implemented.");
    }
}