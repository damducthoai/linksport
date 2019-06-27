import {IRequestModel, Task} from 'backend-base';
import {IRequestConnect} from "backend-base/lib/models/msg/request_connect";
import {RpcServer} from "backend-rpc";
import * as events from 'events';
import {RequestConnectTask} from "./task/request_connect_task";
import {RequestDisConnectTask} from "./task/request_disconnect_task";

export class UserRelationHandler extends RpcServer{

    private typeHandler : any = {};
    
    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]){
        super(config, "UserRelationHandler", globalEvents, extraConfigKeys);
        this.typeHandler = {...this.typeHandler,
            1: new RequestConnectTask(this.globalConfig),
            2: new RequestDisConnectTask(this.globalConfig)
        }
    }
    public onMessage(message: string): Promise<string>{
        return new Promise<string>(async (success, fail) => {
            
            const request : IRequestModel = JSON.parse(message);
            const data = request.data as IRequestConnect;
            const task = this.typeHandler[data.type] as Task;
            if(!task){
                fail(this.errorCodes.noHandler.toString());
                return
            }
            const timeOut = setTimeout(() => {
                fail(this.errorCodes.timeout.toString());
            }, this.processTimeOut)

            task.run(request).then(res => {
                clearInterval(timeOut);
                success(this.errorCodes.success.toString());
            }).catch((err: any) => {
                clearInterval(timeOut);
                fail(err);
            })
        })
    }
}