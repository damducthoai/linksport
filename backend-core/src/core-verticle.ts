export abstract class CoreVerticle {
    protected readonly name: string;
    protected readonly config: any;
    /**
     *
     */
    constructor(config: any, name: string) {
        this.name = name;
        this.config = config[name];
        setTimeout(async () => {
            await this.onInit();
            await this.afterInit();
        }, 10)
    }
    protected onInit(): Promise<number>{
        return new Promise<number>(res => {
            console.log(this.name, 'on init');
            res(0);
        })
    }
    protected afterInit():Promise<number>{
        return new Promise<number>(res => {
            console.log(this.name, 'after init');
            res(0);
        })
    }
}