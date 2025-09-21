import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

export function generateUsername(): string {
  const adjectives = ['cool', 'awesome', 'amazing', 'fantastic', 'incredible', 'wonderful', 'brilliant', 'stellar', 'epic', 'legendary']
  const nouns = ['user', 'creator', 'builder', 'designer', 'developer', 'artist', 'maker', 'innovator', 'pioneer', 'visionary']
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 1000)
  
  return `${adj}-${noun}-${num}`
}
