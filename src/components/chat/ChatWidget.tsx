'use client'
import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, User, Search, Loader2, Minus, ChevronRight, ChevronLeft, MoreHorizontal, Edit, SlidersHorizontal } from 'lucide-react'
import { chatService, ChatMessage } from '@/lib/services/ChatService'
import { ChatApiService, UserChatDto } from '@/lib/services/ChatApiService'
import { useAuthStore } from '@/store/authStore'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function ChatWidget() {
  const { user, isAuthenticated } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [activeChat, setActiveChat] = useState<UserChatDto | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [contacts, setContacts] = useState<UserChatDto[]>([])
  const [suggestions, setSuggestions] = useState<UserChatDto[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeChatRef = useRef<UserChatDto | null>(null)
  const isOpenRef = useRef(isOpen)
  const minimizedRef = useRef(minimized)

  // Synchroniser les refs avec l'état
  useEffect(() => {
    activeChatRef.current = activeChat
    isOpenRef.current = isOpen
    minimizedRef.current = minimized
  }, [activeChat, isOpen, minimized])

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setConnectionStatus('connecting')
      chatService.connect((msg) => {
        const currentActive = activeChatRef.current
        const currentIsOpen = isOpenRef.current
        const currentIsMinimized = minimizedRef.current
        
        setMessages((prev) => {
          if (currentActive && (msg.senderId === currentActive.id || msg.recipientId === currentActive.id)) {
            if (currentIsOpen && !currentIsMinimized && user?.id && msg.senderId) {
              ChatApiService.markAsRead(user.id, msg.senderId)
            }
            return [...prev, msg]
          }
          return prev
        })
        
        loadDefaultContacts()

        if (!currentIsOpen) setIsOpen(true)
        if (currentIsMinimized) setMinimized(false)
      }, () => setConnectionStatus('connected'))
      
      loadDefaultContacts()
      loadSuggestions()
    }
    return () => {
      chatService.disconnect()
      setConnectionStatus('disconnected')
    }
  }, [isAuthenticated, user?.id]) // Uniquement sur l'auth

  const loadDefaultContacts = async () => {
    if (!user?.id) return
    try {
      const results = await ChatApiService.getContacts(user.id)
      setContacts(results)
    } catch (err) {
      console.error(err)
    }
  }

  const loadSuggestions = async () => {
    if (!user?.id) return
    try {
      const results = await ChatApiService.getSuggestions(user.id)
      setSuggestions(results)
    } catch (err) {
      console.error(err)
    }
  }

  // Charger l'historique quand on ouvre une conversation
  useEffect(() => {
    if (activeChat && user?.id) {
      ChatApiService.getMessages(user.id, activeChat.id).then(history => {
        setMessages(history as ChatMessage[])
        // Marquer comme lu
        if (user?.id && activeChat?.id) {
          ChatApiService.markAsRead(user.id, activeChat.id).then(() => {
            loadDefaultContacts()
          })
        }
      })
    }
  }, [activeChat, user?.id])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (searchQuery.length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        setIsSearching(true)
        try {
          const results = await ChatApiService.searchUsers(searchQuery)
          setContacts(results.filter(a => a.id !== user?.id))
        } finally {
          setIsSearching(false)
        }
      }, 300)
      return () => clearTimeout(delayDebounceFn)
    } else if (searchQuery.length === 0) {
      loadDefaultContacts()
    }
  }, [searchQuery, user?.id])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChat) return

    if (connectionStatus !== 'connected') {
      toast.error('Connexion au serveur perdue. Tentative de reconnexion...')
      return
    }

    const sent = chatService.sendMessage(activeChat.id!, newMessage)
    if (sent) {
      setMessages((prev) => [...prev, sent])
      setNewMessage('')
    } else {
      toast.error('Échec de l\'envoi du message')
    }
  }

  const totalUnread = contacts.reduce((acc, c) => acc + (c.unreadCount || 0), 0)
  const [currentTab, setCurrentTab] = useState<'focused' | 'suggestions'>('focused')

  if (!isAuthenticated) return null

  return (
    <div className="fixed bottom-0 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !minimized && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="w-[420px] h-[680px] bg-background border border-foreground/10 shadow-[-20px_0_50px_rgba(0,0,0,0.15)] rounded-t-2xl overflow-hidden flex flex-col mb-0"
          >
            {/* Professional Header */}
            <div className="px-5 py-4 border-b border-foreground/5 bg-background flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeChat && (
                  <button 
                    onClick={() => setActiveChat(null)}
                    className="p-1.5 hover:bg-foreground/5 rounded-full text-foreground/40 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-foreground/5 relative overflow-hidden border border-foreground/10 shadow-sm">
                    {activeChat ? (
                       activeChat.profilePictureUrl ? <Image src={activeChat.profilePictureUrl} alt="" fill className="object-cover" /> : <User className="p-2 w-full h-full text-foreground/20" />
                    ) : (
                       user?.profilePictureUrl ? <Image src={user.profilePictureUrl} alt="" fill className="object-cover" /> : <User className="p-2 w-full h-full text-foreground/20" />
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full"></span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground/90 truncate max-w-[180px]">
                    {activeChat ? activeChat.name : "Messagerie"}
                  </h4>
                  {activeChat && <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-tight">{activeChat.role}</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button onClick={() => setMinimized(true)} className="p-2 hover:bg-foreground/5 rounded-md text-foreground/40 transition-colors">
                  <Minus size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-foreground/5 rounded-md text-rose-500 hover:bg-rose-50 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {activeChat ? (
                <>
                  {/* Active Chat Header / Profile Info */}
                  <div className="p-6 border-b border-foreground/5 flex flex-col items-center text-center bg-foreground/[0.01]">
                    <div className="w-20 h-20 rounded-full bg-foreground/5 relative overflow-hidden mb-3 border-2 border-background shadow-sm">
                      {activeChat.profilePictureUrl ? (
                        <Image src={activeChat.profilePictureUrl} alt="" fill className="object-cover" />
                      ) : <User className="p-5 w-full h-full text-foreground/10" />}
                    </div>
                    <h3 className="font-bold text-lg">{activeChat.name}</h3>
                    <p className="text-xs text-foreground/40 mb-1">{activeChat.role === 'ARTIST' ? 'Artiste sur YowPainter' : 'Membre Collectionneur'}</p>
                    <button className="mt-2 text-[10px] font-black uppercase tracking-widest text-accent hover:opacity-70 transition-opacity">Voir le profil</button>
                  </div>

                  {/* Messages */}
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-white/40">
                    {messages.map((msg, i) => {
                      const isMe = msg.senderId === user?.id
                      return (
                        <div key={i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          {!isMe && (
                            <div className="w-8 h-8 rounded-full bg-foreground/5 relative overflow-hidden flex-shrink-0 mt-1">
                              {activeChat.profilePictureUrl ? <Image src={activeChat.profilePictureUrl} alt="" fill className="object-cover" /> : <User className="p-1.5 w-full h-full text-foreground/20" />}
                            </div>
                          )}
                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              isMe ? 'bg-accent text-white rounded-tr-none' : 'bg-background border border-foreground/5 text-foreground/80 rounded-tl-none'
                            }`}>
                              {msg.content}
                            </div>
                            <span className="text-[9px] mt-1 text-foreground/30 font-medium px-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Input - LinkedIn Style */}
                  <div className="p-4 border-t border-foreground/5 bg-background">
                    <div className="relative bg-foreground/[0.03] rounded-xl border border-foreground/10 focus-within:border-accent/30 transition-all p-2">
                      <textarea 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez un message..."
                        className="w-full bg-transparent border-none resize-none text-sm p-2 outline-none min-h-[80px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage(e as any)
                          }
                        }}
                      />
                      <div className="flex justify-between items-center mt-2 border-t border-foreground/5 pt-2">
                        <div className="flex gap-1">
                          {/* Future icons for attachments */}
                        </div>
                        <button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-accent text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          Envoyer
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden bg-background">
                  {/* Search Bar */}
                  <div className="p-4">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20 w-3.5 h-3.5" />
                      <input 
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-foreground/[0.04] border border-transparent focus:border-foreground/10 rounded-lg pl-10 pr-4 py-2 text-xs outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Suggestions Row (Horizontal) */}
                  {suggestions.length > 0 && searchQuery === "" && (
                    <div className="px-4 pb-4 border-b border-foreground/[0.03]">
                      <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-3">Artistes à découvrir</p>
                      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {suggestions.map(suggestion => (
                          <button 
                            key={suggestion.id}
                            onClick={() => setActiveChat(suggestion)}
                            className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
                          >
                            <div className="w-14 h-14 rounded-full bg-foreground/5 relative overflow-hidden border-2 border-background shadow-sm group-hover:border-accent transition-all">
                              {suggestion.profilePictureUrl ? <Image src={suggestion.profilePictureUrl} alt="" fill className="object-cover" /> : <User className="p-3 w-full h-full text-foreground/20" />}
                            </div>
                            <span className="text-[10px] font-bold text-foreground/60 w-14 truncate text-center">{suggestion.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* History List (Vertical) */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="px-4 py-3 flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Discussions</p>
                      <button className="text-foreground/20 hover:text-accent transition-colors">
                        <SlidersHorizontal size={14} />
                      </button>
                    </div>
                    
                    <div className="divide-y divide-foreground/[0.02]">
                      {contacts.length === 0 && !isSearching && (
                        <div className="flex flex-col items-center justify-center py-20 px-10 text-center opacity-20">
                          <MessageCircle size={32} className="mb-2" />
                          <p className="text-[10px] font-medium">Commencez une nouvelle conversation</p>
                        </div>
                      )}
                      {contacts.map(contact => (
                        <button 
                          key={contact.id}
                          onClick={() => setActiveChat(contact)}
                          className={`w-full flex items-center gap-3 p-4 hover:bg-foreground/[0.02] transition-all text-left ${contact.unreadCount && contact.unreadCount > 0 ? 'bg-accent/[0.03]' : ''}`}
                        >
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-foreground/5 relative overflow-hidden border border-foreground/5 shadow-sm">
                              {contact.profilePictureUrl ? <Image src={contact.profilePictureUrl} alt="" fill className="object-cover" /> : <User className="p-3 w-full h-full text-foreground/20" />}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full"></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <h4 className={`text-sm truncate pr-2 ${contact.unreadCount && contact.unreadCount > 0 ? 'font-black text-foreground' : 'font-semibold text-foreground/80'}`}>
                                {contact.name}
                              </h4>
                              <span className="text-[9px] text-foreground/30 font-medium">10 mai</span>
                            </div>
                            <p className={`text-xs truncate ${contact.unreadCount && contact.unreadCount > 0 ? 'text-foreground font-bold' : 'text-foreground/40 font-medium'}`}>
                              {contact.unreadCount && contact.unreadCount > 0 ? `Nouveau message (${contact.unreadCount})` : "Dernier message ici..."}
                            </p>
                          </div>
                          {contact.unreadCount && contact.unreadCount > 0 && (
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Bar (LinkedIn Style when collapsed) */}
      <button 
        onClick={() => {
          setIsOpen(!isOpen)
          setMinimized(false)
        }}
        className={`w-[320px] px-5 py-4 bg-background border border-foreground/15 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-2xl flex items-center justify-between transition-all hover:bg-foreground/[0.02] ${
          isOpen && !minimized ? 'opacity-0 pointer-events-none translate-y-full' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-foreground/5 relative overflow-hidden border border-foreground/10 shadow-sm">
              {user?.profilePictureUrl ? <Image src={user.profilePictureUrl} alt="" fill className="object-cover" /> : <User className="p-1.5 w-full h-full text-foreground/20" />}
            </div>
            {totalUnread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-background rounded-full"></span>}
          </div>
          <span className="text-sm font-bold text-foreground/80">Messagerie</span>
          {totalUnread > 0 && <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-1">{totalUnread}</span>}
        </div>
        <div className="flex items-center gap-2 text-foreground/30">
          <MoreHorizontal size={16} />
          <Edit size={16} className="ml-1" />
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronRight size={18} className="-rotate-90" />
          </motion.div>
        </div>
      </button>
    </div>
  )
}
