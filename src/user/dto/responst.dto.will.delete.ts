export class ResponseDTO {
  constructor(status: number, errorMessage: string) {
    this.status = status;
    this.errorMessage = errorMessage;
  }
  public status: number;
  public errorMessage: string;
}