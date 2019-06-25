import { IBackendMsg } from "./backend_msg";

export interface IBackendLogin extends IBackendMsg {
    user: string;
    password: string
}