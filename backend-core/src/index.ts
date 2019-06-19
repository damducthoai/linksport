// import * as fs from 'fs';
// import { HttpVerticle } from './http-verticle';
// const args = process.argv.slice(2);

// const config = fs.readFileSync(args[0], 'utf8');
// const configJson = JSON.parse(config);
// const server = new HttpVerticle(configJson);
// const port = configJson['httpServer']['port'] | 8080;

// const server = http.createServer((req, res) => {
//   req.on('data', (chunk) => {
//     const regBody: Uint8Array[] = [];
//     regBody.push(chunk);
//     const regBodyString = Buffer.concat(regBody).toString();
//     const regBodyJson = JSON.parse(regBodyString);
//     res.end('data received')
//   })
// });
// server.on('clientError', (err, socket) => {
//   socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
// });
// server.listen(port);
// console.log('http server start at ', port);
import { AppLauncher } from 'backend-base/lib/index'
import { HttpVerticle } from './http-verticle';

export class BackendCoreLauncher extends AppLauncher {
  /**
   *
   */
  constructor() {
    super();
  }

  public deploy(): Promise<number> {
    return new Promise((accept, reject) => {
      const server = new HttpVerticle(this.config);
    });
  }
  
}
const launcher = new BackendCoreLauncher();
console.log('launcher started');