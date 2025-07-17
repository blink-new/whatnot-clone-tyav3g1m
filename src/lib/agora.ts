// Mock Live Stream Service for Demo
// In production, replace with actual video streaming service like Agora, Twilio, or WebRTC

export interface MockVideoTrack {
  play: (element: HTMLElement) => void
  stop: () => void
  enabled: boolean
  setEnabled: (enabled: boolean) => Promise<void>
}

export interface AgoraUser {
  uid: string | number
  videoTrack?: MockVideoTrack
  audioTrack?: MockVideoTrack
}

export class AgoraService {
  private isJoined = false
  private localVideoTrack: MockVideoTrack | null = null
  private localAudioTrack: MockVideoTrack | null = null
  private mockStream: MediaStream | null = null

  // Event callbacks - set these from components
  onUserJoined?: (uid: string | number, videoTrack?: MockVideoTrack, audioTrack?: MockVideoTrack) => void
  onUserLeft?: (uid: string | number) => void

  async joinChannel(channelName: string, uid: string | number, role: 'host' | 'audience' = 'audience') {
    try {
      console.log(`Joining channel: ${channelName} as ${role}`)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      this.isJoined = true
      
      // Simulate other users joining for audience
      if (role === 'audience') {
        setTimeout(() => {
          // Mock host video track
          const mockVideoTrack: MockVideoTrack = {
            play: (element: HTMLElement) => {
              // Create a mock video element with cooking video
              element.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center relative overflow-hidden">
                  <div class="absolute inset-0 bg-black/20"></div>
                  <div class="text-center text-white z-10">
                    <div class="text-6xl mb-4 animate-bounce">👩‍🍳</div>
                    <h3 class="text-xl font-bold mb-2">Sarah's Live Kitchen</h3>
                    <p class="text-sm opacity-90">Baking fresh chocolate chip cookies!</p>
                    <div class="mt-4 flex justify-center space-x-2">
                      <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <div class="w-2 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                      <div class="w-2 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                    </div>
                  </div>
                  <div class="absolute bottom-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                    🔴 LIVE
                  </div>
                </div>
              `
            },
            stop: () => {},
            enabled: true,
            setEnabled: async (enabled: boolean) => {
              this.localVideoTrack!.enabled = enabled
            }
          }
          
          this.onUserJoined?.('host_sarah', mockVideoTrack)
        }, 1500)
      }
      
      return true
    } catch (error) {
      console.error('Failed to join channel:', error)
      throw error
    }
  }

  async startLocalVideo() {
    try {
      console.log('Starting local video...')
      
      // Try to get real camera access for host
      try {
        this.mockStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        })
      } catch (error) {
        console.log('Camera access denied, using mock video')
      }
      
      this.localVideoTrack = {
        play: (element: HTMLElement) => {
          if (this.mockStream) {
            // Use real camera if available
            const video = document.createElement('video')
            video.srcObject = this.mockStream
            video.autoplay = true
            video.muted = true
            video.className = 'w-full h-full object-cover'
            element.innerHTML = ''
            element.appendChild(video)
          } else {
            // Fallback to mock video
            element.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center relative">
                <div class="text-center text-white">
                  <div class="text-6xl mb-4 animate-pulse">📹</div>
                  <h3 class="text-xl font-bold mb-2">Your Live Stream</h3>
                  <p class="text-sm opacity-90">Camera access needed for real video</p>
                </div>
                <div class="absolute bottom-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                  🔴 LIVE
                </div>
              </div>
            `
          }
        },
        stop: () => {
          if (this.mockStream) {
            this.mockStream.getTracks().forEach(track => track.stop())
            this.mockStream = null
          }
        },
        enabled: true,
        setEnabled: async (enabled: boolean) => {
          this.localVideoTrack!.enabled = enabled
          if (this.mockStream) {
            this.mockStream.getVideoTracks().forEach(track => {
              track.enabled = enabled
            })
          }
        }
      }
      
      this.localAudioTrack = {
        play: () => {},
        stop: () => {},
        enabled: true,
        setEnabled: async (enabled: boolean) => {
          this.localAudioTrack!.enabled = enabled
          if (this.mockStream) {
            this.mockStream.getAudioTracks().forEach(track => {
              track.enabled = enabled
            })
          }
        }
      }
      
      return this.localVideoTrack
    } catch (error) {
      console.error('Failed to start local video:', error)
      throw error
    }
  }

  async stopLocalVideo() {
    if (this.localVideoTrack) {
      this.localVideoTrack.stop()
      this.localVideoTrack = null
    }
    
    if (this.localAudioTrack) {
      this.localAudioTrack.stop()
      this.localAudioTrack = null
    }

    if (this.mockStream) {
      this.mockStream.getTracks().forEach(track => track.stop())
      this.mockStream = null
    }
  }

  async leaveChannel() {
    try {
      await this.stopLocalVideo()
      this.isJoined = false
      console.log('Left channel')
    } catch (error) {
      console.error('Failed to leave channel:', error)
    }
  }

  async switchCamera() {
    console.log('Switching camera...')
    // Mock camera switch
    return Promise.resolve()
  }

  async toggleMicrophone() {
    if (this.localAudioTrack) {
      const newState = !this.localAudioTrack.enabled
      await this.localAudioTrack.setEnabled(newState)
      return newState
    }
    return false
  }

  async toggleCamera() {
    if (this.localVideoTrack) {
      const newState = !this.localVideoTrack.enabled
      await this.localVideoTrack.setEnabled(newState)
      return newState
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