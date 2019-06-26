import {IRequestModel} from "backend-base";
import {CassandraTask} from "backend-base/lib/cassandra_task";
import {IBackendCreatePost} from "backend-base/lib/models/msg/backend_create_post";
import * as Long from "long";

export class CreatePostTask extends CassandraTask {

    private query = "insert into posts(author, event_time, content, status) VALUES (?,?,?,?)";

    constructor(config: any) {
        super('CreatePostTask', config);
    }

    protected exec(input: IRequestModel): Promise<IRequestModel> {
        const data = input.data as IBackendCreatePost;
        return new Promise<IRequestModel>(async (success, fail) => {
            const client = this.getClient();
            const params = [
                data.author,
                Date.now(),
                data.content,
                1
            ]
            client.execute(this.query,params, {hints: ["bigint", "bigint", "text", "int"]}).then(res => {
                data.event_time = params[1] as number;
                input.data = data;
                success(input);
            }).catch(err => {
                fail(err);
            })
        });
    }

}