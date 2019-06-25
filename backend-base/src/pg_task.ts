import { PgPool } from  './pg_pool';
import { Task } from "./task";

export abstract class PgTask extends Task {

    constructor(name: string, config: any) {
        super(name, config)
    }
    
    protected async getPgClient(){
        return await PgPool.getInstance(this.globalConfig).getClient();
    }
}