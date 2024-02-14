import { plainToInstance } from 'class-transformer'
import { BaseOutput } from '../dtos/base-output.dto'
import http from './axios'

export enum METHODS {
	GET = 'GET',
	POST = 'POST',
	DELETE = 'DELETE',
	PUT = 'PUT',
}

export default class BaseService {
  protected prefix = ''

  constructor(prefix: string) {
    this.prefix = prefix
  }

  protected async performRequest(method: METHODS, url: string, data: any = {}, headers = {}): Promise<BaseOutput> {
    const endPoint = this.prefix + (url ? `/${url}` : '')
    const options: any = {
      method,
      url: endPoint,
      data,
      headers,
    }

    options[method === METHODS.GET ? 'params' : 'data'] = data
    return http(options)
      .then(response => plainToInstance(BaseOutput, response.data))
      .catch((reason) => plainToInstance(BaseOutput, reason?.response?.data))
  }
}
