import { Snowflake } from 'backend-base';
import { RpcServer } from "backend-rpc";
import * as bcrypt from 'bcrypt';
import * as events from 'events';
import { Pool } from  'pg';

export class RegisterHandler extends RpcServer {

    private readonly insertQuery = 'insert into account_info(id, username, password, status, create_at) values ($1,$2,$3,$4,CURRENT_TIMESTAMP)';
    private readonly idGenerator: Snowflake;
    private readonly pgSetting : any;
    private readonly pool: any;
    private readonly saltRounds: number;

    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "RegisterHandler", globalEvents, extraConfigKeys);
        this.idGenerator = new Snowflake();
        this.pgSetting = this.config.pgSetting;
        this.pool = new Pool(this.pgSetting);
        this.saltRounds = this.config.saltRounds;
    }
    public onMessage(message: string): Promise<string>{
        this.info(`receive request: ${message}`)
        const curId = this.idGenerator.generate();
        this.info(`request id: ${curId}`);
        const data : {
            user: string,
            password: string
        } = JSON.parse(message);
        return new Promise(async (success, error) => {
            
            const timeOut = setTimeout(() => {
                error('message in processed: ' + curId);
            }, this.processTimeOut)
            
            const [client, password] = await Promise.all([this.pool.connect(), bcrypt.hash(data.password, this.saltRounds)])

            const params = [curId, data.user, password, 0];
        
            client.query(this.insertQuery,params,(err: any, res: any) => {
                if(err){
                    error('user name exists')
                }
                if(res){
                    success("" + curId);
                }
                client.release();
                clearInterval(timeOut);
            })
        });
    }
    protected onEvent(event: string, globalEvents: events): void {
        throw new Error("Method not implemented.");
    }
}