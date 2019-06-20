export interface IRpcServer {
    onMessage(message: string):Promise<string>;
}