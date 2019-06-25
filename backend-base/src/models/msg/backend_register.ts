import { IBackendMsg } from "./backend_msg";

export interface IBackendRegister extends IBackendMsg {
    id?: number;
    user: string;
    password: string
}