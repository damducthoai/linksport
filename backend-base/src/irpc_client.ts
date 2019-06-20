export interface IRpcClient {
    sendMessage(message: string):Promise<number>;
}