import { IRequestModel } from './models/backend_request';
import { Task } from './Task';

export class WorkFlow extends Task {
    protected readonly name: string;
    protected readonly taskList: Task[] = [];
    protected readonly stopWhenFail: boolean;
    /**
     *
     */
    constructor(name: string, config: any, stopWhenFail?: boolean) {
        super(name, config);
        this.name = name;
        this.stopWhenFail = stopWhenFail ? true : false;
    }
    
    public run(input: IRequestModel):Promise<IRequestModel> {
        return this.exec(input);
    }
    protected exec(input: IRequestModel):Promise<IRequestModel> {
        return new Promise(async (success, fail) => {
            let result = input;
            for (const task of this.taskList) {
                if(!result.success && this.stopWhenFail){
                    fail(result);
                    return;
                }
                try {
                    result = await task.run(result);
                }catch(err){
                    this.error(`excetion occur: ` + err);
                    if(this.stopWhenFail){
                        fail(result);
                        return;
                    }
                }
            }
            success(result);
        })
    };
    protected addTask(task: Task){
        this.taskList.push(task);
    }
}