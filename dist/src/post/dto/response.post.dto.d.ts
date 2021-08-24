export declare class ResponsePostDTO {
    constructor(id: number, title: string, writer: string, content: string, boardType: string, tags: string[], comments: any[], timeStamp: Date, userCheck: boolean);
    id: number;
    title: string;
    writer: string;
    content: string;
    boardType: string;
    tags: string[];
    comments: any[];
    timeStamp: Date;
    userCheck: boolean;
}
