export class ErrorMessage extends Error {
  type: string;
  message: string;
  status: number;
  constructor(type: string, message: string, status: number) {
    super();
    this.type = type;
    this.message = message;
    this.status = status;
  }
}
