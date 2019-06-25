import { IBackendMsg } from "./msg/backend_msg";

export interface IRequestModel {
    service: string;
    data: IBackendMsg;
    success: boolean;
}