import * as amqp from 'amqplib/callback_api';
import { Snowflake } from 'backend-base';
import { IBackendLogin } from 'backend-base';
import { RpcServer } from "backend-rpc";
import * as bcrypt from 'bcryptjs';
import * as events from 'events';
import * as jwt from 'jsonwebtoken';
import { Pool } from  'pg';
import { launcher } from '../index'

export class LoginHandler extends RpcServer {

    private query = "select password , id from account_info where username = $1";

    constructor(config: any, protected globalEvents: events, extraConfigKeys?: string[]) {
        super(config, "LoginHandler", globalEvents, extraConfigKeys);
    }
    public onMessage(message: string): Promise<string> {
        const data : IBackendLogin = JSON.parse(message);
        return new Promise(async(success, error) => {
            
            const pool = launcher.getPgPool() as Pool;
            const [client] = await Promise.all([pool.connect()])
            const params = [data.user];
            
            const timeOut = setTimeout(() => {
                error(this.errorCodes.timeout.code);
            }, this.processTimeOut)
            client.query(this.query,params, async (err: any, res: any) => {
                if(err){
                    error(this.errorCodes.loginFail);
                }
                if(res && (res.rows as []).length > 0){
                    const dbHash = res.rows[0].password.toString();
                    
                    const isvalid = await bcrypt.compare(data.password,dbHash);
                    if(isvalid){
                        const key = this.globalConfig.jwt.key;
                        const tokenDuration = this.globalConfig.jwt.duration as number;
                        const iat = Date.now();
                        const exp = iat + tokenDuration;
                        const id = res.rows[0].id;
                        const token = jwt.sign({
                            id,
                            user: data.user,
                            iat,
                            exp
                        }, key);
                        success(token);
                    } else {
                        error(this.errorCodes.loginFail.code);
                    }
                } else {
                    error(this.errorCodes.loginFail.code);
                }
                client.release();
                clearInterval(timeOut);
            })
        });
    }
}