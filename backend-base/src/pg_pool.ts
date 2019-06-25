import { Pool } from  'pg';
import { config } from 'winston';

export class PgPool {

    public static getInstance(_config: any){
        if(this.instance == null){
            this.instance = new PgPool(_config);
        }
        return this.instance;
    };
    private static instance ?: PgPool;

    private pool?: Pool;
   
    private constructor(config: any) {
        this.pool = new Pool(config);
    }
    
    public async getClient(){
        if(this.pool){
            return await this.pool.connect();    
        }
        throw Error('cannot init client');
    }
}