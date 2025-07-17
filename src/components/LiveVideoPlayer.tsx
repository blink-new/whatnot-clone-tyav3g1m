import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  RotateCcw, 
  Users, 
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react'
import { agoraService } from '../lib/agora'
import type { ICameraVideoTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng'

interface LiveVideoPlayerProps {
  channelName: string
  isHost?: boolean
  onViewerCountChange?: (count: number) => void
  className?: string
}

export function LiveVideoPlayer({ 
  channelName, 
  isHost = false, 
  onViewerCountChange,
  className = '' 
}: LiveVideoPlayerProps) {
  const localVideoRef = useRef<HTMLDivElement>(null)
  const remoteVideoRef = useRef<HTMLDivElement>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isMicEnabled, setIsMicEnabled] = useState(true)
  const [isCameraEnabled, setIsCameraEnabled] = useState(true)
  const [viewerCount, setViewerCount] = useState(0)
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState<Map<string | number, IRemoteVideoTrack>>(new Map())

  useEffect(() => {
    // Set up event handlers
    agoraService.onUserJoined = (uid, videoTrack) => {
      if (videoTrack && remoteVideoRef.current) {
        videoTrack.play(remoteVideoRef.current)
        setRemoteUsers(prev => new Map(prev.set(uid, videoTrack)))
        setViewerCount(prev => prev + 1)
      }
    }

    agoraService.onUserLeft = (uid) => {
      setRemoteUsers(prev => {
        const newMap = new Map(prev)
        newMap.delete(uid)
        return newMap
      })
      setViewerCount(prev => Math.max(0, prev - 1))
    }

    return () => {
      handleLeaveChannel()
    }
  }, [])

  useEffect(() => {
    onViewerCountChange?.(viewerCount)
  }, [viewerCount, onViewerCountChange])

  const handleJoinChannel = async () => {
    try {
      const uid = `user_${Date.now()}`
      const role = isHost ? 'host' : 'audience'
      
      await agoraService.joinChannel(channelName, uid, role)
      setIsJoined(true)
      
      if (isHost) {
        await startStreaming()
      }
    } catch (error) {
      console.error('Failed to join channel:', error)
    }
  }

  const startStreaming = async () => {
    try {
      const localVideoTrack = await agoraService.startLocalVideo()
      
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.play(localVideoRef.current)
        setIsStreaming(true)
      }
    } catch (error) {
      console.error('Failed to start streaming:', error)
    }
  }

  const handleLeaveChannel = async () => {
    await agoraService.leaveChannel()
    setIsJoined(false)
    setIsStreaming(false)
    setRemoteUsers(new Map())
    setViewerCount(0)
  }

  const toggleMicrophone = async () => {
    const enabled = await agoraService.toggleMicrophone()
    setIsMicEnabled(enabled)
  }

  const toggleCamera = async () => {
    const enabled = await agoraService.toggleCamera()
    setIsCameraEnabled(enabled)
  }

  const switchCamera = async () => {
    await agoraService.switchCamera()
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
  }

  return (
    <Card className={`relative overflow-hidden bg-black ${className}`}>
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900">
        {/* Host Video (Local) */}
        {isHost && isStreaming && (
          <div 
            ref={localVideoRef} 
            className="absolute inset-0 w-full h-full"
          />
        )}
        
        {/* Viewer Video (Remote) */}
        {!isHost && remoteUsers.size > 0 && (
          <div 
            ref={remoteVideoRef} 
            className="absolute inset-0 w-full h-full"
          />
        )}
        
        {/* Placeholder when no video */}
        {(!isStreaming && isHost) || (!isHost && remoteUsers.size === 0) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {isHost ? 'Start your live stream' : 'Waiting for stream to start...'}
              </p>
            </div>
          </div>
        )}

        {/* Live Badge */}
        {isStreaming && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">
            🔴 LIVE
          </Badge>
        )}

        {/* Viewer Count */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1 text-white">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">{viewerCount}</span>
        </div>

        {/* Stream Controls (Host Only) */}
        {isHost && isJoined && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Button
              size="sm"
              variant={isMicEnabled ? "default" : "destructive"}
              onClick={toggleMicrophone}
              className="rounded-full w-10 h-10 p-0"
            >
              {isMicEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant={isCameraEnabled ? "default" : "destructive"}
              onClick={toggleCamera}
              className="rounded-full w-10 h-10 p-0"
            >
              {isCameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={switchCamera}
              className="rounded-full w-10 h-10 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Viewer Actions */}
        {!isHost && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleLike}
              className={`rounded-full w-10 h-10 p-0 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="rounded-full w-10 h-10 p-0 bg-white/20 text-white"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="rounded-full w-10 h-10 p-0 bg-white/20 text-white"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Stream Stats */}
      {isStreaming && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-4">
              <span>{viewerCount} viewers</span>
              <span>{likes} likes</span>
            </div>
            <div className="text-xs opacity-75">
              Channel: {channelName}
            </div>
          </div>
        </div>
      )}

      {/* Join/Leave Controls */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex justify-center">
          {!isJoined ? (
            <Button onClick={handleJoinChannel} className="bg-green-500 hover:bg-green-600">
              {isHost ? 'Start Live Stream' : 'Join Stream'}
            </Button>
          ) : (
            <Button onClick={handleLeaveChannel} variant="destructive">
              {isHost ? 'End Stream' : 'Leave Stream'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}