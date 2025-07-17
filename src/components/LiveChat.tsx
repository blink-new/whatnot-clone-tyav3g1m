import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Card } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Send, Heart, Gift, Crown } from 'lucide-react'

interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar?: string
  message: string
  timestamp: Date
  type: 'message' | 'like' | 'gift' | 'join' | 'bid'
  amount?: number
  isHost?: boolean
  isModerator?: boolean
}

interface LiveChatProps {
  channelName: string
  currentUser?: {
    id: string
    username: string
    avatar?: string
    isHost?: boolean
    isModerator?: boolean
  }
  className?: string
}

export function LiveChat({ channelName, currentUser, className = '' }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'host',
      username: 'BakingMama',
      message: 'Welcome to my kitchen! Fresh chocolate chip cookies coming out of the oven! 🍪',
      timestamp: new Date(Date.now() - 300000),
      type: 'message',
      isHost: true
    },
    {
      id: '2',
      userId: 'user1',
      username: 'CookieLover',
      message: 'Those look amazing! How much for a dozen?',
      timestamp: new Date(Date.now() - 240000),
      type: 'message'
    },
    {
      id: '3',
      userId: 'user2',
      username: 'LocalFoodie',
      message: 'I bid $15 for the chocolate chip cookies!',
      timestamp: new Date(Date.now() - 180000),
      type: 'bid',
      amount: 15
    },
    {
      id: '4',
      userId: 'user3',
      username: 'SweetTooth',
      message: '$18 for the cookies!',
      timestamp: new Date(Date.now() - 120000),
      type: 'bid',
      amount: 18
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !currentUser) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      message: newMessage,
      timestamp: new Date(),
      type: 'message',
      isHost: currentUser.isHost,
      isModerator: currentUser.isModerator
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const sendLike = () => {
    if (!currentUser) return

    const likeMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      message: 'liked the stream',
      timestamp: new Date(),
      type: 'like',
      isHost: currentUser.isHost,
      isModerator: currentUser.isModerator
    }

    setMessages(prev => [...prev, likeMessage])
  }

  const sendGift = (amount: number) => {
    if (!currentUser) return

    const giftMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      message: `sent a gift`,
      timestamp: new Date(),
      type: 'gift',
      amount,
      isHost: currentUser.isHost,
      isModerator: currentUser.isModerator
    }

    setMessages(prev => [...prev, giftMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderMessage = (msg: ChatMessage) => {
    const baseClasses = "flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
    
    switch (msg.type) {
      case 'like':
        return (
          <div key={msg.id} className={`${baseClasses} bg-red-50`}>
            <Heart className="w-4 h-4 text-red-500 mt-1 fill-current" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-red-600">{msg.username}</span>
                <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-sm text-red-600">{msg.message}</p>
            </div>
          </div>
        )
      
      case 'gift':
        return (
          <div key={msg.id} className={`${baseClasses} bg-yellow-50`}>
            <Gift className="w-4 h-4 text-yellow-500 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-yellow-600">{msg.username}</span>
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                  ${msg.amount}
                </Badge>
                <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-sm text-yellow-600">{msg.message}</p>
            </div>
          </div>
        )
      
      case 'bid':
        return (
          <div key={msg.id} className={`${baseClasses} bg-green-50 border-l-4 border-green-500`}>
            <Avatar className="w-6 h-6">
              <AvatarImage src={msg.avatar} />
              <AvatarFallback className="text-xs">{msg.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-green-700">{msg.username}</span>
                <Badge className="text-xs bg-green-500">BID ${msg.amount}</Badge>
                <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-sm text-green-700 font-medium">{msg.message}</p>
            </div>
          </div>
        )
      
      default:
        return (
          <div key={msg.id} className={baseClasses}>
            <Avatar className="w-6 h-6">
              <AvatarImage src={msg.avatar} />
              <AvatarFallback className="text-xs">{msg.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium text-sm ${msg.isHost ? 'text-orange-600' : 'text-gray-900'}`}>
                  {msg.username}
                </span>
                {msg.isHost && <Crown className="w-3 h-3 text-orange-500" />}
                {msg.isModerator && <Badge variant="outline" className="text-xs">MOD</Badge>}
                <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-700 break-words">{msg.message}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-lg">Live Chat</h3>
        <p className="text-sm text-gray-600">{messages.length} messages</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-2" ref={scrollAreaRef}>
        <div className="space-y-1">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <Button
            size="sm"
            variant="outline"
            onClick={sendLike}
            className="flex items-center gap-1 text-red-500 hover:text-red-600"
          >
            <Heart className="w-4 h-4" />
            Like
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sendGift(5)}
            className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600"
          >
            <Gift className="w-4 h-4" />
            $5
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sendGift(10)}
            className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600"
          >
            <Gift className="w-4 h-4" />
            $10
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentUser ? "Type a message..." : "Sign in to chat"}
            disabled={!currentUser}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !currentUser}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}