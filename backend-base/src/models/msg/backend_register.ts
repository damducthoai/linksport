import { IBackendMsg } from "./backend_msg";

export interface IBackendRegister extends IBackendMsg {
    user: string;
    password: string
}