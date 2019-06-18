import * as http from 'http';
import { CoreVerticle } from "./core-verticle";

export class HttpVerticle extends CoreVerticle {
    private port: number = 8080;
    /**
     *
     */
    constructor(config: any) {
        super(config, "HttpVerticle");  
        this.port = this.config.port as number;
    }
    protected onInit(){
        return new Promise<number>(res => {
            const server = http.createServer((req, res) => {
                req.on('data', (chunk) => {
                  const regBody: Uint8Array[] = [];
                  regBody.push(chunk);
                  const regBodyString = Buffer.concat(regBody).toString();
                  const regBodyJson = JSON.parse(regBodyString);
                  res.end('data received')
                })
                res.end('data received no reg body');
              });
            server.listen(this.port);
            res(0);
        })
    }

    protected afterInit(){
        return new Promise<number>(res => {
            console.log(this.name, `start at port ${this.port}`);
            res(0);
        })
    }

}