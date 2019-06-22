import { AppLauncher, CoreVerticle } from 'backend-base';
import { RegisterHandler } from './user/RegisterHandler';
export class BackendEventHandlerLauncher extends AppLauncher {
    /**
     *
     */
    constructor() {
        super("BackendEventHandlerLauncher");
    }

    public deploy(): Promise<number> {
        return new Promise((success, fail) => {
            const registerHandler = new RegisterHandler(this.config, this.globalEvents);
            this.verticles.push(registerHandler);
            success(0);
        });
    }
}
const launcher = new BackendEventHandlerLauncher();
export {
    launcher,
}