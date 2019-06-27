import {IRequestModel} from "backend-base";
import {CassandraTask} from "backend-base/lib/cassandra_task";
import {IRequestConnect} from "backend-base/lib/models/msg/request_connect";

export class RequestConnectTask extends CassandraTask {

    private query = "insert into users_relation(user_id, status, event_time, issuer, relate_to) VALUES (?,?,?,?,?)";

    constructor(config: any) {
        super('CreatePostTask', config);
    }

    protected exec(input: IRequestModel): Promise<IRequestModel> {
        const data = input.data as IRequestConnect;
        const client = this.getClient();
        const time = Date.now();
        return new Promise<IRequestModel>(async (success, fail) => {
            client.batch([
                {
                    query: this.query,
                    // tslint:disable-next-line:object-literal-sort-keys
                    params: [data.issuer, 1, time, data.issuer, data.relate_to]
                },
                {
                    query: this.query,
                    // tslint:disable-next-line:object-literal-sort-keys
                    params: [data.relate_to, 0, time, data.issuer, data.issuer]
                }
            ], { prepare: true }).then(res => {
                success(input);
            }).catch(err => {
                this.error(JSON.stringify(input));
                fail(this.errorCodes.rconnectFail);
            })
        });
    }

}