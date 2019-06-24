import * as events from 'events';
import { Pool } from  'pg';
import { CoreVerticle } from "./core-verticle";

export class PgVerticle extends CoreVerticle {

    protected readonly pool: Pool;

    constructor(config: any, name: string, globalEvents: events, extraConfigKeys?: string[]) {
        super(config, name , globalEvents, extraConfigKeys);
        this.pool = new Pool(config.postgresql);
    }
    public getPool(): Pool {
        return this.pool;
    }

}