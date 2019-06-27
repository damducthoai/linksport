import {IRequestModel} from "backend-base";
import {IBackendCreatePost} from "backend-base/lib/models/msg/backend_create_post";
import {RpcServer} from "backend-rpc";
import * as events from 'events';
import {CreatePostTask} from "./task/create_post_task";

export class CreatePostHandler extends RpcServer{

    private createPostTask: CreatePostTask;
    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "CreatePostHandler", globalEvents, extraConfigKeys);
        this.createPostTask = new CreatePostTask(this.globalConfig);
    }
    public onMessage(message: string): Promise<string> {
        const request : IRequestModel = JSON.parse(message);
        return new Promise(async(success, fail) => {

            const timeOut = setTimeout(() => {
                fail(this.errorCodes.timeout);
            }, this.processTimeOut)

            this.createPostTask.run(request).then(res => {
                const data = res.data as IBackendCreatePost;
                data.content = "";
                clearInterval(timeOut);
                success(message);
            }).catch((err: any) => {
                clearInterval(timeOut);
                fail(err);
            })
        });
    }
}