import {IBackendMsg} from "./backend_msg";

export interface IBackendCreatePost extends IBackendMsg {
    author: number;
    content: string;
    event_time?: number;
}