import { Snowflake } from 'backend-base';
import { RpcServer } from "backend-rpc";
import * as events from 'events';
import * as cassandra from 'cassandra-driver';
export class RegisterHandler extends RpcServer {

    private idGenerator: Snowflake;

    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "RegisterHandler", globalEvents, extraConfigKeys);
        this.idGenerator = new Snowflake();
    }
    public onMessage(message: string): Promise<string>{
        this.info('xx');
        let data : {
            user: string,
            password: string
        } = JSON.parse(message);
        return new Promise((success, error) => {
            const authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');
            const client = new cassandra.Client({contactPoints: ['3.0.101.223'], keyspace: 'dev', authProvider, localDataCenter: 'datacenter1'});
            const query = 'insert into users(username, id, password) VALUES (?,?,?)';

            const timeOut = setTimeout(() => {
                success('message processed: ' + this.idGenerator.generate());
            }, this.processTimeOut)
            const params =  [ data.user, this.idGenerator.generate(), data.password ];
            client.execute(query, params , { prepare: true })
                    .then(result => {
                        this.info('result' + result);
                        success('data created');
                    }).catch(error => {
                        this.error('err cause ' + error);
                        error('exception cause');
                    }).finally(() => {
                        clearTimeout(timeOut);
                    });
        });
    }
    protected onEvent(event: string, globalEvents: events): void {
        throw new Error("Method not implemented.");
    }
}