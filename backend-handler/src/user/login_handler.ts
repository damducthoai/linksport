import * as amqp from 'amqplib/callback_api';
import { Snowflake } from 'backend-base';
import { RpcServer } from "backend-rpc";
import * as bcrypt from 'bcryptjs';
import * as events from 'events';
import { Pool } from  'pg';
import { launcher } from '../index'

export class LoginHandler extends RpcServer {

    private query = "select password as password from account_info where username = $1";

    private readonly saltRounds: number;

    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "LoginHandler", globalEvents, extraConfigKeys);
        this.saltRounds = this.config.saltRounds;
    }
    public onMessage(message: string): Promise<string> {
        const data : {
            user: string,
            password: string
        } = JSON.parse(message);
        return new Promise(async(success, error) => {
            
            const pool = launcher.getPgPool() as Pool;
            const [client] = await Promise.all([pool.connect()])
            const params = [data.user];
            
            const timeOut = setTimeout(() => {
                error(this.errorCodes.timeout);
            }, this.processTimeOut)
            client.query(this.query,params, async (err: any, res: any) => {
                if(err){
                    error(this.errorCodes.loginFail);
                }
                if(res && (res.rows as []).length > 0){
                    const dbHash = res.rows[0].password.toString();
                    const isvalid = await bcrypt.compareSync(data.password,dbHash);
                    if(isvalid){
                        success('login success');
                    } else {
                        error(this.errorCodes.loginFail);
                    }
                } else {
                    error(this.errorCodes.loginFail);
                }
                client.release();
                clearInterval(timeOut);
            })
        });
    }
}