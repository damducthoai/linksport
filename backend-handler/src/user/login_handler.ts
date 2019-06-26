import {  IBackendLogin, IRequestModel } from 'backend-base';
import { RpcServer } from "backend-rpc";
import * as events from 'events';
import { LoginTask } from './task/login_task';


export class LoginHandler extends RpcServer {

    private readonly loginTask: LoginTask;

    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "LoginHandler", globalEvents, extraConfigKeys);
        this.loginTask = new LoginTask(this.globalConfig);
    }
    public onMessage(message: string): Promise<string> {
        const data : IRequestModel = JSON.parse(message);
        return new Promise(async(success, fail) => {

            const timeOut = setTimeout(() => {
                fail(this.errorCodes.timeout);
            }, this.processTimeOut)

            this.loginTask.run(data).then(res => {
                clearInterval(timeOut);
                success((res.data  as IBackendLogin).token);
            }).catch(err => {
                clearInterval(timeOut);
                fail(err);
            })
        });
    }
}