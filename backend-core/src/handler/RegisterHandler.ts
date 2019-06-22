import { RpcServer } from "backend-rpc";

export class RegisterHandler extends RpcServer {
    /**
     *
     */
    constructor(config: any) {
        super(config.RegisterHandler);
    }
    public onMessage(message: string): Promise<string>{
        return new Promise((success, error) => {
            setTimeout(() => {
                success('message processed');
            }, this.processTimeOut)
        });
    }
}