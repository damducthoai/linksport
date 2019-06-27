import {IBackendMsg} from "./backend_msg";

export interface IRequestConnect extends IBackendMsg{
    issuer: number;
    type: number;
    relate_to: number;
    event_time: number;
}