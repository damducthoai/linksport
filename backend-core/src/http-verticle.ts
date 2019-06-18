import * as http from 'http';
import { Validator } from 'jsonschema';
import { CoreVerticle } from "./core-verticle";


export class HttpVerticle extends CoreVerticle {
    private port: number;
    private validator: Validator;
    private readonly eventBinding: any;
    /**
     *
     */
    constructor(config: any) {
        super(config, "HttpVerticle");  
        this.port = this.config.port as number;
        this.eventBinding = this.config.eventBinding;
        this.validator = new Validator();
        Object.keys(this.eventBinding).forEach(key => {
            const schema = this.eventBinding[key].schema
            this.validator.addSchema(schema, schema.id)
        });
    }
    protected onInit(){
        return new Promise<number>(res => {
            const server = http.createServer((req, res) => {
                req.on('data', async (chunk) => {
                  const regBody: Uint8Array[] = [];
                  regBody.push(chunk);
                  const regBodyString = Buffer.concat(regBody).toString();
                  const regBodyJson = JSON.parse(regBodyString);
                  const schema = this.eventBinding.login.schema
                  const validationResult = this.validator.validate(regBodyJson, schema).valid
                  this.info(`validate event ${schema}: ${validationResult.toString()}`)
                  res.end(`validate event ${schema}: ${validationResult.toString()}`)
                })
                //res.end('data received no reg body');
              });
            server.listen(this.port);
            res(0);
        })
    }

    protected afterInit(){
        return new Promise<number>(res => {
            this.info(`start at ${this.port}`)
            res(0);
        })
    }
}