import { Pool } from  'pg';

export class PgPool {

    public static getInstance(config: any){
        if(this.instance == null){
            this.instance = new PgPool(config);
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