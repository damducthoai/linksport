import { AppLauncher, CoreVerticle } from 'backend-base/lib/index';
import { RabbitRpcClient } from 'backend-rpc/lib/index';
import { RegisterHandler } from './handler/RegisterHandler';
import { HttpVerticle } from './http-verticle';

export class BackendCoreLauncher extends AppLauncher {

  public eventHandler: any = {};

  private verticles : CoreVerticle[] = [];

  constructor() {
    super();
  }

  public deploy(): Promise<number> {
    return new Promise((accept, reject) => {
      const server = new HttpVerticle(this.config, this.globalEvents);
      this.verticles.push(server);
      const registerHandler = new RegisterHandler(this.config);
      const eventBinding = this.config.HttpVerticle.eventBinding;
      const events = Object.keys(eventBinding).forEach(e => {
        const event = eventBinding[`${e.toString()}`] // object config
        const rabitRpcConfig = this.config.RabbitRpcClient;
          const privateConfig = {...rabitRpcConfig, "queue": event.addr}
          const globalConfig = {...this.info, "RabbitRpcClient": privateConfig};
          const rpcclient = new RabbitRpcClient(globalConfig, this.globalEvents);
          this.verticles.push(rpcclient);
          this.eventHandler[`${e.toString()}`] = rpcclient;
      });
      this.info(`deployed ${this.verticles.length} verticle(s)`);
      accept(this.verticles.length)
    });
  }
  
}
const launcher = new BackendCoreLauncher();
export {
  launcher
};