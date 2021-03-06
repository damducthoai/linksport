import { IRequestModel, PgTask, IBackendLogin} from 'backend-base'
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class LoginTask extends PgTask {

    private query = "select password , id from account_info where username = $1";

    constructor(config: any) {
        super('LoginTask', config);
    }

    protected exec(input: IRequestModel): Promise<IRequestModel> {
        return new Promise(async(success, fail) => {
            const data = input.data as IBackendLogin;
            const client = await this.getPgClient();
            const params = [data.user];
            
            client.query(this.query,params, async (err: any, res: any) => {
                if(err){
                    fail(this.errorCodes.registerFail);
                } else {
                    if(res && (res.rows as []).length > 0){
                        const hashed = res.rows[0].password;
                        const isvalid = await bcrypt.compare(data.password,hashed);
                        if(isvalid){
                            const key = this.globalConfig.jwt.key;
                            const tokenDuration = this.globalConfig.jwt.duration as number;
                            const iat = Date.now();
                            const exp = iat + tokenDuration;
                            const id = res.rows[0].id;
                            data.token = jwt.sign({
                                id,
                                user: data.user,
                                iat,
                                exp
                            }, key);
                            success(input);
                        } else {
                            fail(this.errorCodes.loginFail);
                        }
                    } else {
                        fail(this.errorCodes.registerFail)
                    }
                }
                client.release();
            })
        })
    }
}