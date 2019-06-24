import { AppLauncher, PgVerticle } from 'backend-base';
import { Pool } from  'pg';
import { RegisterHandler } from './user/RegisterHandler';

export class BackendEventHandlerLauncher extends AppLauncher {

    private  pgVerticle?: PgVerticle;
    /**
     *
     */
    constructor() {
        super("BackendEventHandlerLauncher");
    }

    public deploy(): Promise<number> {
        return new Promise((success, fail) => {
            this.pgVerticle = new PgVerticle(this.config, "PgVerticle", this.globalEvents);
            this.verticles.push(this.pgVerticle);

            const registerHandler = new RegisterHandler(this.config, this.globalEvents);
            this.verticles.push(registerHandler);

            success(0);
        });
    }
    public getPgPool(): Pool | any {
        return this.pgVerticle ? this.pgVerticle.getPool() : null;
    }
}
const launcher = new BackendEventHandlerLauncher();
export {
    launcher
}