export class WithdrawInput {
  id: number
  status: number

  constructor(id: number, status: number) {
    this.id = id
    this.status = status
  }
}
