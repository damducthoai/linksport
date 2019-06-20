import { CoreVerticle } from "backend-base";
import * as events from 'events';

export class RegisterVerticle extends CoreVerticle {
    
/**
 *
 */
    constructor(config: any, globalEvents: events) {
        super(config, "RegisterVerticle", globalEvents);
    }
    protected onEvent(event: string, globalEvents: events): void {
        globalEvents.on(event, async msg => {
            this.info(`receive message: ${msg}`);
        })
    }
}