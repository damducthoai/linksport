import {IRequestModel} from "backend-base";
import {CassandraTask} from "backend-base/lib/cassandra_task";
import {IRequestConnect} from "backend-base/lib/models/msg/request_connect";

export class RequestDisConnectTask extends CassandraTask {

    private query = "delete from users_relation where user_id = ? and relate_to = ?";

    constructor(config: any) {
        super('RequestDisConnectTask', config);
    }

    protected exec(input: IRequestModel): Promise<IRequestModel> {
        const data = input.data as IRequestConnect;
        const client = this.getClient();
        return new Promise<IRequestModel>(async (success, fail) => {
            client.batch([
                {
                    query: this.query,
                    // tslint:disable-next-line:object-literal-sort-keys
                    params: [data.issuer, data.relate_to]
                },
                {
                    query: this.query,
                    // tslint:disable-next-line:object-literal-sort-keys
                    params: [data.relate_to,data.issuer]
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