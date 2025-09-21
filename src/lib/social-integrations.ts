import { prisma } from './prisma'

export interface SocialProfile {
  id: string
  username: string
  displayName: string
  bio?: string
  profilePicture?: string
  followerCount?: number
  isVerified?: boolean
  url: string
}

export interface SocialPost {
  id: string
  caption?: string
  mediaUrl?: string
  mediaType: 'image' | 'video' | 'carousel'
  permalink: string
  timestamp: Date
  likesCount?: number
  commentsCount?: number
}

export class SocialIntegrations {
  // Instagram Integration
  static async getInstagramProfile(accessToken: string): Promise<SocialProfile | null> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
      )
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      return {
        id: data.id,
        username: data.username,
        displayName: data.username,
        followerCount: data.media_count,
        url: `https://instagram.com/${data.username}`,
        isVerified: data.account_type === 'BUSINESS'
      }
    } catch (error) {
      console.error('Instagram profile error:', error)
      return null
    }
  }

  static async getInstagramPosts(accessToken: string, limit = 6): Promise<SocialPost[]> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count&limit=${limit}&access_token=${accessToken}`
      )
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      return data.data.map((post: any) => ({
        id: post.id,
        caption: post.caption,
        mediaUrl: post.media_url,
        mediaType: post.media_type.toLowerCase(),
        permalink: post.permalink,
        timestamp: new Date(post.timestamp),
        likesCount: post.like_count,
        commentsCount: post.comments_count
      }))
    } catch (error) {
      console.error('Instagram posts error:', error)
      return []
    }
  }

  // YouTube Integration
  static async getYouTubeChannel(apiKey: string, channelId: string): Promise<SocialProfile | null> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
      )
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      const channel = data.items?.[0]
      if (!channel) return null

      return {
        id: channel.id,
        username: channel.snippet.customUrl || channel.snippet.title,
        displayName: channel.snippet.title,
        bio: channel.snippet.description,
        profilePicture: channel.snippet.thumbnails.high?.url,
        followerCount: parseInt(channel.statistics.subscriberCount),
        url: `https://youtube.com/channel/${channel.id}`
      }
    } catch (error) {
      console.error('YouTube channel error:', error)
      return null
    }
  }

  static async getYouTubeVideos(apiKey: string, channelId: string, limit = 6): Promise<SocialPost[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${limit}&order=date&type=video&key=${apiKey}`
      )
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      return data.items.map((video: any) => ({
        id: video.id.videoId,
        caption: video.snippet.title,
        mediaUrl: video.snippet.thumbnails.high?.url,
        mediaType: 'video' as const,
        permalink: `https://youtube.com/watch?v=${video.id.videoId}`,
        timestamp: new Date(video.snippet.publishedAt)
      }))
    } catch (error) {
      console.error('YouTube videos error:', error)
      return []
    }
  }

  // TikTok Integration (requires TikTok for Developers)
  static async getTikTokProfile(accessToken: string): Promise<SocialProfile | null> {
    try {
      const response = await fetch(
        'https://open-api.tiktok.com/user/info/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: ['open_id', 'username', 'display_name', 'avatar_url', 'bio_description', 'profile_deep_link', 'is_verified', 'follower_count']
          })
        }
      )
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      const user = data.data.user
      return {
        id: user.open_id,
        username: user.username,
        displayName: user.display_name,
        bio: user.bio_description,
        profilePicture: user.avatar_url,
        followerCount: user.follower_count,
        isVerified: user.is_verified,
        url: user.profile_deep_link
      }
    } catch (error) {
      console.error('TikTok profile error:', error)
      return null
    }
  }

  static async getTikTokVideos(accessToken: string, limit = 6): Promise<SocialPost[]> {
    try {
      const response = await fetch(
        'https://open-api.tiktok.com/video/list/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: ['id', 'title', 'video_description', 'duration', 'cover_image_url', 'share_url', 'view_count', 'like_count', 'comment_count', 'share_count'],
            max_count: limit
          })
        }
      )
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      return data.data.videos.map((video: any) => ({
        id: video.id,
        caption: video.title || video.video_description,
        mediaUrl: video.cover_image_url,
        mediaType: 'video' as const,
        permalink: video.share_url,
        timestamp: new Date(), // TikTok API doesn't provide creation time in basic version
        likesCount: video.like_count,
        commentsCount: video.comment_count
      }))
    } catch (error) {
      console.error('TikTok videos error:', error)
      return []
    }
  }

  // Spotify Integration
  static async getSpotifyProfile(accessToken: string): Promise<SocialProfile | null> {
    try {
      const response = await fetch(
        'https://api.spotify.com/v1/me',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      return {
        id: data.id,
        username: data.id,
        displayName: data.display_name || data.id,
        profilePicture: data.images?.[0]?.url,
        followerCount: data.followers?.total,
        url: data.external_urls?.spotify || `https://open.spotify.com/user/${data.id}`
      }
    } catch (error) {
      console.error('Spotify profile error:', error)
      return null
    }
  }

  static async getSpotifyTopTracks(accessToken: string, limit = 6): Promise<SocialPost[]> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=short_term`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      return data.items.map((track: any) => ({
        id: track.id,
        caption: `${track.name} - ${track.artists.map((a: any) => a.name).join(', ')}`,
        mediaUrl: track.album.images?.[0]?.url,
        mediaType: 'image' as const,
        permalink: track.external_urls.spotify,
        timestamp: new Date()
      }))
    } catch (error) {
      console.error('Spotify tracks error:', error)
      return []
    }
  }

  // Twitter/X Integration (using Twitter API v2)
  static async getTwitterProfile(bearerToken: string, username: string): Promise<SocialProfile | null> {
    try {
      const response = await fetch(
        `https://api.twitter.com/2/users/by/username/${username}?user.fields=id,name,username,description,profile_image_url,public_metrics,verified`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        }
      )
      
      const data = await response.json()
      
      if (data.errors) {
        throw new Error(data.errors[0].detail)
      }

      const user = data.data
      return {
        id: user.id,
        username: user.username,
        displayName: user.name,
        bio: user.description,
        profilePicture: user.profile_image_url,
        followerCount: user.public_metrics?.followers_count,
        isVerified: user.verified,
        url: `https://twitter.com/${user.username}`
      }
    } catch (error) {
      console.error('Twitter profile error:', error)
      return null
    }
  }

  static async getTwitterTweets(bearerToken: string, userId: string, limit = 6): Promise<SocialPost[]> {
    try {
      const response = await fetch(
        `https://api.twitter.com/2/users/${userId}/tweets?max_results=${limit}&tweet.fields=created_at,public_metrics,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        }
      )
      
      const data = await response.json()
      
      if (data.errors) {
        throw new Error(data.errors[0].detail)
      }

      return data.data?.map((tweet: any) => ({
        id: tweet.id,
        caption: tweet.text,
        mediaUrl: data.includes?.media?.[0]?.url || data.includes?.media?.[0]?.preview_image_url,
        mediaType: 'image' as const,
        permalink: `https://twitter.com/user/status/${tweet.id}`,
        timestamp: new Date(tweet.created_at),
        likesCount: tweet.public_metrics?.like_count,
        commentsCount: tweet.public_metrics?.reply_count
      })) || []
    } catch (error) {
      console.error('Twitter tweets error:', error)
      return []
    }
  }

  // Save social integration to database
  static async saveSocialIntegration(
    userId: string,
    platform: string,
    accessToken: string,
    refreshToken?: string,
    expiresAt?: Date,
    profileData?: any
  ) {
    try {
      return await prisma.socialIntegration.upsert({
        where: {
          userId_platform: {
            userId,
            platform
          }
        },
        update: {
          accessToken,
          refreshToken,
          expiresAt,
          profileData,
          isActive: true
        },
        create: {
          userId,
          platform,
          accessToken,
          refreshToken,
          expiresAt,
          profileData,
          isActive: true
        }
      })
    } catch (error) {
      console.error('Save social integration error:', error)
      throw error
    }
  }

  // Get user's social integrations
  static async getUserSocialIntegrations(userId: string) {
    try {
      return await prisma.socialIntegration.findMany({
        where: {
          userId,
          isActive: true
        }
      })
    } catch (error) {
      console.error('Get social integrations error:', error)
      return []
    }
  }

  // Refresh expired tokens (simplified - you'd implement OAuth refresh flow)
  static async refreshTokenIfNeeded(integration: any) {
    if (!integration.expiresAt || integration.expiresAt > new Date()) {
      return integration.accessToken
    }

    // Implement refresh token logic for each platform
    switch (integration.platform) {
      case 'instagram':
        return await this.refreshInstagramToken(integration.refreshToken)
      case 'spotify':
        return await this.refreshSpotifyToken(integration.refreshToken)
      // Add other platforms as needed
      default:
        return integration.accessToken
    }
  }

  private static async refreshInstagramToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(
        'https://graph.instagram.com/refresh_access_token',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'ig_refresh_token',
            refresh_token: refreshToken
          })
        }
      )

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Instagram token refresh error:', error)
      throw error
    }
  }

  private static async refreshSpotifyToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(
        'https://accounts.spotify.com/api/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
        }
      )

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Spotify token refresh error:', error)
      throw error
    }
  }

  // Auto-sync social content to blocks
  static async autoSyncSocialContent(userId: string, pageId: string) {
    try {
      const integrations = await this.getUserSocialIntegrations(userId)
      
      for (const integration of integrations) {
        const accessToken = await this.refreshTokenIfNeeded(integration)
        
        let posts: SocialPost[] = []
        
        switch (integration.platform) {
          case 'instagram':
            posts = await this.getInstagramPosts(accessToken, 3)
            break
          case 'youtube':
            if (integration.profileData?.channelId) {
              posts = await this.getYouTubeVideos(
                process.env.YOUTUBE_API_KEY!,
                integration.profileData.channelId,
                3
              )
            }
            break
          case 'tiktok':
            posts = await this.getTikTokVideos(accessToken, 3)
            break
          case 'spotify':
            posts = await this.getSpotifyTopTracks(accessToken, 3)
            break
        }

        // Create or update social blocks
        for (const post of posts) {
          await prisma.block.upsert({
            where: {
              pageId_data: {
                pageId,
                data: { socialPostId: post.id }
              }
            },
            update: {
              title: post.caption?.substring(0, 50) + '...',
              data: {
                platform: integration.platform,
                socialPostId: post.id,
                mediaUrl: post.mediaUrl,
                permalink: post.permalink,
                lastSync: new Date()
              }
            },
            create: {
              pageId,
              type: 'social',
              title: post.caption?.substring(0, 50) + '...',
              position: 999, // Add to end
              data: {
                platform: integration.platform,
                socialPostId: post.id,
                mediaUrl: post.mediaUrl,
                permalink: post.permalink,
                lastSync: new Date()
              },
              isActive: true,
              clicks: 0
            }
          })
        }
      }
    } catch (error) {
      console.error('Auto-sync social content error:', error)
    }
  }
}

