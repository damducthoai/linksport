import { CoreVerticle } from "backend-base";
import { RpcClient } from "backend-rpc";
import * as events from 'events';
import * as http from 'http';
import { Validator } from 'jsonschema';
import { launcher } from './index'


export class HttpVerticle extends CoreVerticle {
    
    private readonly port: number;
    private readonly validator: Validator;
    private readonly eventBinding: any;
    private readonly allowUrl: string;
    private readonly allowMethod: string;

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
                    this.handleFailureEvent(req, response, 'method not support');
                    return;
                }
                // TODO - handle empty body
                req.on('data', async (chunk) => {
                  const regBody: Uint8Array[] = [];
                  regBody.push(chunk);
                  const regBodyString = Buffer.concat(regBody).toString();
                  const regBodyJson = JSON.parse(regBodyString);
                  const service = regBodyJson.service
                  const eventHandler = launcher.eventHandler[`${service.toString()}`] as RpcClient;
                  if(!eventHandler){
                      this.handleFailureEvent(req, response, 'service unavailable');
                      return;
                  }
                  const schema = this.eventBinding[service].schema
                  const validationResult = this.validator.validate(regBodyJson, schema).valid
                  if(validationResult) {
                    try {
                        const result = await eventHandler.sendMessage(JSON.stringify(regBodyJson.data));
                        this.handleSuccessResponse(req, response, result);
                        return;
                    }catch(err){
                        this.error(`exception on handling ${service} | request body: ${regBodyString}`);
                        this.handleFailureEvent(req, response, err.toString());
                        return;
                    }
                  } else {
                    this.handleFailureEvent(req, response, 'invalid request');
                  }
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
    private handleSuccessResponse(request: http.IncomingMessage, response: http.ServerResponse, msg: string) {
        const responseData = JSON.stringify({
            data: msg,
            success: true
        });
        this.sendResponse(request, response, responseData);
    }
    private handleFailureEvent(request: http.IncomingMessage, response: http.ServerResponse, msg: string){
        const responseData = JSON.stringify({
            error: msg,
            success: false
        });
        this.sendResponse(request, response, responseData);
    }
    private sendResponse(request: http.IncomingMessage, response: http.ServerResponse, msg: string){
        response.setHeader("Content-Type", "application/json");
        response.end(msg);
    }
}