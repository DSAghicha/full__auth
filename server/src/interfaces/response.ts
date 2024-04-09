export default interface IResponse {
    success: boolean;
    code: number;
    message: string;
    data?: any;
    // next: string;
}
