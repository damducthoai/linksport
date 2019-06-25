import { IBackendMsg } from "./msg/backend_msg";

export interface IRequestModel {
    service: string;
    data: IBackendMsg;
    success: boolean;
    user_id?: string;
    user_profile?: any
    request_id: string;
}