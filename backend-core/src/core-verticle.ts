import * as winston from 'winston';
export abstract class CoreVerticle {
    protected readonly name: string;
    protected readonly config: any;
    private readonly logger: any;
    /**
     *
     */
    constructor(config: any, name: string) {
        this.name = name;
        this.config = config[name];
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console()
            ]
        });
        setTimeout(async () => {
            await this.onInit();
            await this.afterInit();
        }, 10)
    }
    protected onInit(): Promise<number>{
        return new Promise<number>(res => {
            this.info('on init')
            res(0);
        })
    }
    protected afterInit():Promise<number>{
        return new Promise<number>(res => {
            this.info('after init')
            res(0);
        })
    }
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