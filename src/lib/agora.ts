import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  ILocalVideoTrack,
  ILocalAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack
} from 'agora-rtc-sdk-ng'

// Agora configuration
export const AGORA_CONFIG = {
  // Agora App ID from environment variables
  appId: import.meta.env.VITE_AGORA_APP_ID || 'your-agora-app-id',
  // For production, you should generate tokens server-side
  token: null as string | null
}

export interface AgoraUser {
  uid: string | number
  videoTrack?: IRemoteVideoTrack
  audioTrack?: IRemoteAudioTrack
}

export class AgoraService {
  private client: IAgoraRTCClient
  private localVideoTrack: ICameraVideoTrack | null = null
  private localAudioTrack: IMicrophoneAudioTrack | null = null
  private isJoined = false

  constructor() {
    this.client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.client.on('user-published', async (user, mediaType) => {
      await this.client.subscribe(user, mediaType)
      
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack
        if (remoteVideoTrack) {
          // Emit event for UI to handle
          this.onUserJoined?.(user.uid, remoteVideoTrack, user.audioTrack)
        }
      }
      
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack
        if (remoteAudioTrack) {
          remoteAudioTrack.play()
        }
      }
    })

    this.client.on('user-unpublished', (user) => {
      this.onUserLeft?.(user.uid)
    })

    this.client.on('user-left', (user) => {
      this.onUserLeft?.(user.uid)
    })
  }

  // Event callbacks - set these from components
  onUserJoined?: (uid: string | number, videoTrack?: IRemoteVideoTrack, audioTrack?: IRemoteAudioTrack) => void
  onUserLeft?: (uid: string | number) => void

  async joinChannel(channelName: string, uid: string | number, role: 'host' | 'audience' = 'audience') {
    try {
      // Set client role
      await this.client.setClientRole(role)
      
      // Join the channel
      await this.client.join(AGORA_CONFIG.appId, channelName, AGORA_CONFIG.token, uid)
      this.isJoined = true
      
      return true
    } catch (error) {
      console.error('Failed to join channel:', error)
      throw error
    }
  }

  async startLocalVideo() {
    try {
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      
      // Publish tracks
      await this.client.publish([this.localVideoTrack, this.localAudioTrack])
      
      return this.localVideoTrack
    } catch (error) {
      console.error('Failed to start local video:', error)
      throw error
    }
  }

  async stopLocalVideo() {
    if (this.localVideoTrack) {
      this.localVideoTrack.stop()
      this.localVideoTrack.close()
      this.localVideoTrack = null
    }
    
    if (this.localAudioTrack) {
      this.localAudioTrack.stop()
      this.localAudioTrack.close()
      this.localAudioTrack = null
    }
  }

  async leaveChannel() {
    try {
      await this.stopLocalVideo()
      
      if (this.isJoined) {
        await this.client.leave()
        this.isJoined = false
      }
    } catch (error) {
      console.error('Failed to leave channel:', error)
    }
  }

  async switchCamera() {
    if (this.localVideoTrack) {
      await this.localVideoTrack.switchDevice()
    }
  }

  async toggleMicrophone() {
    if (this.localAudioTrack) {
      await this.localAudioTrack.setEnabled(!this.localAudioTrack.enabled)
      return this.localAudioTrack.enabled
    }
    return false
  }

  async toggleCamera() {
    if (this.localVideoTrack) {
      await this.localVideoTrack.setEnabled(!this.localVideoTrack.enabled)
      return this.localVideoTrack.enabled
    }
    return false
  }

  getLocalVideoTrack() {
    return this.localVideoTrack
  }

  isChannelJoined() {
    return this.isJoined
  }
}

// Create a singleton instance
export const agoraService = new AgoraService()