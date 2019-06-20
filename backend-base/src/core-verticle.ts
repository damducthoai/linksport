import * as winston from 'winston';
export abstract class CoreVerticle {
    protected readonly extraConfig = {};
    protected readonly name: string;
    protected readonly config: any;
    private readonly logger: any;
    /**
     *
     */
    constructor(config: any, name: string, private extraConfigKeys?: string[]) {
        this.name = name;
        this.config = config[name];
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console()
            ]
        });
        if(extraConfigKeys){
            extraConfigKeys.forEach((k,i) => {
                const curConfig = config[k];
                Object.assign(this.extraConfig, curConfig);
            })
        }
        setTimeout(async () => {
            await this.onInit();
            await this.afterInit();
        }, 1)
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