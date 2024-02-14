export enum STATUS {
	SUCCESS = 'Success',
	ERROR = 'Error',
}
export class BaseOutput {
	status: STATUS = STATUS.ERROR;
	message: string = '';
	data: any = null;
	code: string = '';
}
