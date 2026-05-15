import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'
import { CancelablePromise } from '../core/CancelablePromise'

export interface UserChatDto {
  id: string
  name: string
  profilePictureUrl?: string
  role: string
  unreadCount?: number
}

export interface ChatMessageDto {
  id?: string
  chatId?: string
  senderId: string
  recipientId: string
  content: string
  timestamp: string
}

export class ChatApiService {
  public static getContacts(userId: string): CancelablePromise<Array<UserChatDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/chat/contacts/${userId}`,
    })
  }

  public static searchUsers(q: string): CancelablePromise<Array<UserChatDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/search',
      query: { q },
    })
  }

  public static getSuggestions(userId: string): CancelablePromise<Array<UserChatDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/chat/suggestions/${userId}`,
    })
  }

  public static markAsRead(recipientId: string, senderId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'POST',
      url: `/api/chat/read/${recipientId}/${senderId}`,
    })
  }

  public static getMessages(senderId: string, recipientId: string): CancelablePromise<Array<ChatMessageDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/messages/${senderId}/${recipientId}`,
    })
  }
}
