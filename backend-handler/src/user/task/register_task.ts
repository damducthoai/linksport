import { IBackendRegister, IRequestModel, PgTask} from 'backend-base'
import * as bcrypt from 'bcryptjs';
export class RegisterTask extends PgTask {
    private readonly saltRounds: number;
    private readonly insertQuery = 'insert into account_info(id, username, password, status, create_at) values (shard_register.id_generator(),$1,$2,$3,CURRENT_TIMESTAMP) returning id';

    constructor(config: any) {
        super('RegisterTask', config)
        this.saltRounds = this.config.saltRounds as number || 10;
    }

    protected exec(input: IRequestModel): Promise<IRequestModel> {
        return new Promise(async(success, fail) => {
            const data = input.data as IBackendRegister;
            const [client, password] = await Promise.all([ this.getPgClient(), bcrypt.hash(data.password, this.saltRounds)])
            const params = [data.user, password, 0];
            
            client.query(this.insertQuery,params,(err: any, res: any) => {
                if(err){
                    fail(this.errorCodes.registerFail.code);
                } else {
                    if(res && (res.rows as []).length > 0){
                        const createdId = res.rows[0].id;
                        
                        success(input);
                    } else {
                        fail(this.errorCodes.registerFail.code)
                    }
                }
                client.release();
            })
        })
    }
}