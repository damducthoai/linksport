import * as events from 'events';
import * as fs from 'fs';
import * as winston from 'winston';
import { CoreVerticle } from './core-verticle';

export abstract class AppLauncher {

    protected readonly config:any;
    protected readonly globalEvents = new events.EventEmitter();
    protected readonly verticles : CoreVerticle[] = [];
    
    private readonly logger: any;
    
    /**
     *
     */
    constructor(private name: string) {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console()
            ]
        });
        const args = process.argv.slice(2);
        if(args.length < 1){
            throw Error('args missing');
        }
        const config = fs.readFileSync(args[0], 'utf8');
        this.config = JSON.parse(config);
        this.info(`launching ${this.config.profile}`);
        setTimeout(async () => {
            await this.deploy();
            this.info(`deployed ${this.verticles.length} verticle(s)`);
        }, 1)
    }
    public abstract deploy():Promise<number>;
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