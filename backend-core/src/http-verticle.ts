import { CoreVerticle } from "backend-base/lib/index";
import * as events from 'events';
import * as http from 'http';
import { Validator } from 'jsonschema';



export class HttpVerticle extends CoreVerticle {
    
    
    private readonly port: number;
    private readonly validator: Validator;
    private readonly eventBinding: any;
    private readonly allowUrl: string;
    private readonly allowMethod: string;
    /**
     *
     */
    constructor(config: any, globalEvents: events) {
        super(config, "HttpVerticle", globalEvents);
        this.port = this.config.port as number;
        this.eventBinding = this.config.eventBinding;
        this.validator = new Validator();
        this.allowMethod = this.config.allowMethod;
        this.allowUrl = this.config.allowUrl;
        this.registerValidator();
    }
    protected onEvent(event: string, globalEvents: events): void {
        throw new Error("Method not implemented.");
    }
    protected onInit(){
        return new Promise<number>(res => {
            const server = http.createServer((req, response) => {
                if(this.allowMethod !== req.method || this.allowUrl !== req.url) {
                    response.end('method not support');
                    return;
                }
                // TODO - handle empty body
                req.on('data', async (chunk) => {
                  const regBody: Uint8Array[] = [];
                  regBody.push(chunk);
                  const regBodyString = Buffer.concat(regBody).toString();
                  const regBodyJson = JSON.parse(regBodyString);
                  const schema = this.eventBinding.login.schema
                  const validationResult = this.validator.validate(regBodyJson, schema).valid
                  this.info(`validate event ${schema}: ${validationResult.toString()}`)
                  response.end(`validate event ${schema}: ${validationResult.toString()}`)
                })
              });
            server.on('clientError', (err, socket) => {
                socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
            });
            server.listen(this.port);
            res(0);
        })
    }

    protected afterInit(){
        return new Promise<number>(res => {
            this.info(`start at ${this.port}`)
            this.info(`extra config ${JSON.stringify(this.extraConfig)}`)
            res(0);
        })
    }
    private registerValidator(){
        Object.keys(this.eventBinding).forEach(key => {
            const schema = this.eventBinding[key].schema
            this.validator.addSchema(schema, schema.id)
        });
    }
}