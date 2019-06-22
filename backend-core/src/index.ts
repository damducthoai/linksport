import { AppLauncher, CoreVerticle } from 'backend-base/lib/index';
import { RabbitRpcClient } from 'backend-rpc/lib/index';
import { HttpVerticle } from './http-verticle';

export class BackendCoreLauncher extends AppLauncher {
  private verticles : CoreVerticle[] = [];

  constructor() {
    super();
  }

  public deploy(): Promise<number> {
    return new Promise((accept, reject) => {
      const server = new HttpVerticle(this.config, this.globalEvents);
      this.verticles.push(server);
      const eventBinding = this.config.HttpVerticle.eventBinding;
      const addrs = Object.keys(eventBinding).map(e => eventBinding[`${e.toString()}`].addr);
      addrs.forEach(addr => {
          const rabitRpcConfig = this.config.RabbitRpcClient;
          const privateConfig = {...rabitRpcConfig, "queue": addr}
          const globalConfig = {...this.info, "RabbitRpcClient": privateConfig};
          const rpcclient = new RabbitRpcClient(globalConfig, this.globalEvents);
          this.verticles.push(rpcclient);
      });
      this.info(`deployed ${this.verticles.length} verticle(s)`);
      accept(this.verticles.length)
    });
  }
  
}
const launcher = new BackendCoreLauncher();