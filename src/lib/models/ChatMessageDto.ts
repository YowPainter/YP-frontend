/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatMessageDto = {
    id?: string;
    chatId?: string;
    senderId?: string;
    recipientId?: string;
    content?: string;
    timestamp?: string;
    status?: ChatMessageDto.status;
};
export namespace ChatMessageDto {
    export enum status {
        SENT = 'SENT',
        DELIVERED = 'DELIVERED',
        READ = 'READ',
    }
}

