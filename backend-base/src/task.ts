import * as winston from 'winston';
import { BackendError } from './backend_error';
import { IRequestModel } from './models/backend_request';

export abstract class Task {
    protected readonly name: string;
    protected readonly logger: any;
    protected readonly globalConfig: any;
    protected readonly config: any;
    protected readonly errorCodes = BackendError;
    /**
     *
     */
    constructor(name: string, config: any) {
        this.name = name;
        this.globalConfig = config;
        this.config = config[name]
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console()
            ]
        });
    }
    public run(input: IRequestModel):Promise<IRequestModel> {
        return this.exec(input);
    };
    protected abstract exec(input: IRequestModel):Promise<IRequestModel>;
   
    protected info(msg: string){
        this.logger.info(`${this.name} | ${msg}`);
    }

    protected warn(msg: string) {
        this.logger.warn(`${this.name} | ${msg}`);
    }

    protected error(msg: string) {
        this.logger.error(`${this.name} | ${msg}`);
    } 
    
}