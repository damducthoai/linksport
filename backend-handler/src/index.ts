import { AppLauncher, PgVerticle } from 'backend-base';
import { Pool } from  'pg';
import {CreatePostHandler} from "./user/create_post_handler";
import { LoginHandler } from './user/login_handler';
import { RegisterHandler } from './user/RegisterHandler';
import {UserRelationHandler} from "./user/user_relation_handler";

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

            const loginHandler = new LoginHandler(this.config, this.globalEvents);
            this.verticles.push(loginHandler)

            const createPostHandler = new CreatePostHandler(this.config, this.globalEvents);
            this.verticles.push(createPostHandler);

            const userRelationHandler = new UserRelationHandler(this.config, this.globalEvents);
            this.verticles.push(userRelationHandler);
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