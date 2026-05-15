import { Client, IMessage, Stomp } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuthStore } from '@/store/authStore'
import { OpenAPI } from '../core/OpenAPI'

export interface ChatMessage {
  id?: string
  senderId: string
  recipientId: string
  content: string
  timestamp: string
}

class ChatService {
  private client: Client | null = null
  private onMessageReceived: ((message: ChatMessage) => void) | null = null

  public connect(onMessage: (message: ChatMessage) => void, onConnect?: () => void) {
    const token = useAuthStore.getState().token
    if (!token) return

    this.onMessageReceived = onMessage

    const socket = new SockJS(`${OpenAPI.BASE}/ws`)
    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log('STOMP DEBUG:', str)
      },
      onConnect: () => {
        console.log('STOMP Connected SUCCESS')
        if (onConnect) onConnect()
        this.client?.subscribe('/user/queue/messages', (message: IMessage) => {
          console.log('STOMP Received:', message.body)
          if (this.onMessageReceived) {
            this.onMessageReceived(JSON.parse(message.body))
          }
        })
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message'])
        console.error('STOMP Full Frame:', frame)
      },
      onWebSocketClose: (evt) => {
        console.log('STOMP WebSocket Closed:', evt)
      },
      onDisconnect: () => {
        console.log('STOMP Disconnected')
      }
    })

    this.client.activate()
  }

  public disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.client = null
    }
  }

  public sendMessage(recipientId: string, content: string) {
    if (this.client && this.client.connected) {
      const senderId = useAuthStore.getState().user?.id
      if (!senderId) return

      const message: ChatMessage = {
        senderId,
        recipientId,
        content,
        timestamp: new Date().toISOString()
      }

      this.client.publish({
        destination: '/app/chat',
        body: JSON.stringify(message)
      })

      return message
    }
    return null
  }
}

export const chatService = new ChatService()
