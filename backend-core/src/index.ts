import { AppLauncher } from 'backend-base';
import { RabbitRpcClient } from 'backend-rpc';
import { HttpVerticle } from './http-verticle';

export class BackendCoreLauncher extends AppLauncher {

  public eventHandler: any = {};

  constructor() {
    super("BackendCoreLauncher");
  }

  public deploy(): Promise<number> {
    return new Promise((accept, reject) => {
      const server = new HttpVerticle(this.config, this.globalEvents);
      this.verticles.push(server);
      const eventBinding = this.config.HttpVerticle.eventBinding;
      Object.keys(eventBinding).forEach(e => {
          const event = eventBinding[`${e.toString()}`] // object config
          const rabitRpcConfig = this.config.RabbitRpcClient;
          const privateConfig = {...rabitRpcConfig, "queue": event.addr}
          const globalConfig = {...this.info, "RabbitRpcClient": privateConfig};
          const rpcclient = new RabbitRpcClient(globalConfig, this.globalEvents);
          this.verticles.push(rpcclient);
          this.eventHandler[`${e.toString()}`] = rpcclient;
      });
      accept(this.verticles.length)
    });
  }
  
}
const launcher = new BackendCoreLauncher();
export {
  launcher
};