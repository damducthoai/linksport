import { AppLauncher } from 'backend-base';

export class BackendListenerLauncher extends AppLauncher {
    constructor() {
        super("BackendListenerLauncher");
    }
    deploy(): Promise<number> {
        throw new Error("Method not implemented.");
    }
}

const launcher = new BackendListenerLauncher();
export {
    launcher
}