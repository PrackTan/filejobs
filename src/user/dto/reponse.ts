export class ResponseDto {
    constructor(
        public statusCode: number,
        public message: string,
        public data?: any
    ) {}
}