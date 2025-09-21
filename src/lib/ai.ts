import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from './prisma'

// Inicializar Gemini só se a API key existir
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Helper function to check if Gemini is available
function ensureGemini() {
  if (!genAI || !process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your environment variables.');
  }
  return genAI.getGenerativeModel({ model: "gemini-pro" });
}

// Helper function to make Gemini API calls
async function callGemini(prompt: string): Promise<string> {
  const model = ensureGemini();
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content with Gemini AI');
  }
}

// Export individual functions for easier importing
export async function generateBio(userData: { name: string; interests?: string[]; socialMedia?: string[] }): Promise<string> {
  return AIService.generateBio({
    name: userData.name,
    interests: userData.interests,
    socialLinks: userData.socialMedia,
  });
}

export async function generateStyleRecommendations(contentCategory: string, userPreferences: string[]): Promise<{ colors: string[]; font: string; animation: string }> {
  const result = await AIService.generateColorPalette({
    industry: contentCategory,
    mood: userPreferences.join(', '),
  });
  
  return {
    colors: result.palette,
    font: 'Inter',
    animation: 'fade-in',
  };
}

export async function generateLinkPreviewSummary(url: string, content: string): Promise<{ title: string; description: string }> {
  const result = await AIService.generateLinkMetadata(url, content);
  return {
    title: result.title,
    description: result.description,
  };
}

export class AIService {
  // Generate bio based on user data and social media
  static async generateBio(userData: {
    name?: string
    username?: string
    occupation?: string
    interests?: string[]
    socialLinks?: string[]
    existingBio?: string
  }): Promise<string> {
    const prompt = `
    Create a compelling and professional bio for a LinkTree page based on this information:
    
    Name: ${userData.name || userData.username || 'User'}
    ${userData.occupation ? `Occupation: ${userData.occupation}` : ''}
    ${userData.interests?.length ? `Interests: ${userData.interests.join(', ')}` : ''}
    ${userData.socialLinks?.length ? `Social platforms: ${userData.socialLinks.join(', ')}` : ''}
    ${userData.existingBio ? `Current bio: ${userData.existingBio}` : ''}
    
    Requirements:
    - Maximum 150 characters
    - Professional yet engaging tone
    - Include emojis where appropriate
    - Focus on value proposition
    - Make it memorable and clickable
    
    Generate 3 different bio options and return them as a JSON array like this:
    ["Bio option 1", "Bio option 2", "Bio option 3"]
    
    Return ONLY the JSON array, no other text.
    `

    try {
      const content = await callGemini(prompt);
      
      // Try to parse as JSON, fallback to single bio
      try {
        const parsed = JSON.parse(content.trim());
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If JSON parsing fails, return as single bio
        return [content.trim()];
      }
    } catch (error) {
      console.error('AI Bio Generation Error:', error);
      // Return fallback bio
      const fallbackName = userData.name || userData.username || 'User';
      return [`🌟 ${fallbackName} | Creating amazing content daily ✨`];
    }
  }

  // Generate link titles and descriptions
  static async generateLinkMetadata(url: string, context?: string): Promise<{
    title: string
    description: string
    suggestedStyle: string
    category: string
  }> {
    const prompt = `
    Analyze this URL and generate optimized metadata for a LinkTree link:
    
    URL: ${url}
    ${context ? `Context: ${context}` : ''}
    
    Generate:
    1. Compelling title (max 40 characters)
    2. Engaging description (max 80 characters)  
    3. Suggested visual style (glassmorphism, minimal, neon, gradient, etc.)
    4. Category (social, business, creative, ecommerce, etc.)
    
    Return as JSON with keys: title, description, suggestedStyle, category
    
    Example:
    {
      "title": "My Portfolio",
      "description": "Check out my latest projects and work",
      "suggestedStyle": "glassmorphism",
      "category": "creative"
    }
    
    Return ONLY the JSON object, no other text.
    `

    try {
      const content = await callGemini(prompt);
      return JSON.parse(content.trim());
    } catch (error) {
      console.error('AI Link Metadata Error:', error);
      return {
        title: 'Check this out',
        description: 'Interesting content worth exploring',
        suggestedStyle: 'glassmorphism',
        category: 'general'
      }
    }
  }

  // Generate color palette based on brand/content
  static async generateColorPalette(brandInfo: {
    industry?: string
    mood?: string
    existingColors?: string[]
    brandName?: string
  }): Promise<{
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    palette: string[]
  }> {
    const prompt = `
    Generate a cohesive color palette for a LinkTree page:
    
    ${brandInfo.brandName ? `Brand: ${brandInfo.brandName}` : ''}
    ${brandInfo.industry ? `Industry: ${brandInfo.industry}` : ''}
    ${brandInfo.mood ? `Desired mood: ${brandInfo.mood}` : ''}
    ${brandInfo.existingColors?.length ? `Existing colors: ${brandInfo.existingColors.join(', ')}` : ''}
    
    Generate a modern, accessible color palette with:
    - Primary color (main brand color)
    - Secondary color (complementary)
    - Accent color (for highlights)
    - Background color
    - Text color (high contrast)
    - 5 additional palette colors
    
    Return as JSON with hex color codes.
    Ensure WCAG AA compliance for text contrast.
    
    Example:
    {
      "primary": "#6366f1",
      "secondary": "#8b5cf6",
      "accent": "#f59e0b",
      "background": "#ffffff",
      "text": "#1f2937",
      "palette": ["#6366f1", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"]
    }
    
    Return ONLY the JSON object, no other text.
    `

    try {
      const content = await callGemini(prompt);
      return JSON.parse(content.trim());
    } catch (error) {
      console.error('AI Color Palette Error:', error);
      return {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1f2937',
        palette: ['#6366f1', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981']
      }
    }
  }

  // Generate content suggestions based on niche
  static async generateContentSuggestions(userProfile: {
    niche?: string
    existingLinks?: string[]
    goals?: string[]
    audience?: string
  }): Promise<{
    links: Array<{
      title: string
      description: string
      url?: string
      type: string
    }>
    strategies: string[]
  }> {
    const prompt = `
    Generate content suggestions for a LinkTree page:
    
    ${userProfile.niche ? `Niche: ${userProfile.niche}` : ''}
    ${userProfile.audience ? `Target audience: ${userProfile.audience}` : ''}
    ${userProfile.goals?.length ? `Goals: ${userProfile.goals.join(', ')}` : ''}
    ${userProfile.existingLinks?.length ? `Current links: ${userProfile.existingLinks.join(', ')}` : ''}
    
    Suggest:
    1. 8 strategic link ideas with titles and descriptions
    2. 5 growth strategies specific to their niche
    
    Focus on conversion, engagement, and audience building.
    Return as JSON with 'links' and 'strategies' arrays.
    
    Example:
    {
      "links": [
        {"title": "About Me", "description": "Learn my story", "type": "page"},
        {"title": "Portfolio", "description": "See my work", "type": "creative"}
      ],
      "strategies": [
        "Post consistently on social media",
        "Engage with your community daily"
      ]
    }
    
    Return ONLY the JSON object, no other text.
    `

    try {
      const content = await callGemini(prompt);
      return JSON.parse(content.trim());
    } catch (error) {
      console.error('AI Content Suggestions Error:', error);
      return {
        links: [
          { title: 'About Me', description: 'Learn more about my story', type: 'page' },
          { title: 'Contact', description: 'Get in touch', type: 'contact' }
        ],
        strategies: ['Optimize your bio for your target audience', 'Add social proof']
      }
    }
  }

  // Analyze page performance and suggest improvements
  static async analyzePagePerformance(pageData: {
    blocks: any[]
    analytics: {
      views: number
      clicks: number
      topPerformingBlocks: string[]
      lowPerformingBlocks: string[]
    }
    theme: any
  }): Promise<{
    score: number
    improvements: Array<{
      type: 'critical' | 'important' | 'suggestion'
      title: string
      description: string
      impact: string
    }>
    predictions: {
      potentialIncrease: string
      timeframe: string
    }
  }> {
    const clickRate = pageData.analytics.views > 0 ? 
      ((pageData.analytics.clicks / pageData.analytics.views) * 100).toFixed(2) : '0';

    const prompt = `
    Analyze this LinkTree page performance and suggest improvements:
    
    Page data:
    - Total blocks: ${pageData.blocks.length}
    - Page views: ${pageData.analytics.views}
    - Total clicks: ${pageData.analytics.clicks}
    - Click-through rate: ${clickRate}%
    - Top performing blocks: ${pageData.analytics.topPerformingBlocks.join(', ') || 'None'}
    - Low performing blocks: ${pageData.analytics.lowPerformingBlocks.join(', ') || 'None'}
    
    Block types: ${pageData.blocks.map(b => b.type).join(', ')}
    
    Provide:
    1. Overall performance score (0-100)
    2. Specific improvements categorized by priority
    3. Predicted impact of implementing changes
    
    Return as JSON with score, improvements array, and predictions object.
    
    Example:
    {
      "score": 75,
      "improvements": [
        {
          "type": "important",
          "title": "Optimize link order",
          "description": "Move high-performing links to the top",
          "impact": "Could increase clicks by 15-25%"
        }
      ],
      "predictions": {
        "potentialIncrease": "20-30%",
        "timeframe": "2-4 weeks"
      }
    }
    
    Return ONLY the JSON object, no other text.
    `

    try {
      const content = await callGemini(prompt);
      return JSON.parse(content.trim());
    } catch (error) {
      console.error('AI Performance Analysis Error:', error);
      return {
        score: 75,
        improvements: [
          {
            type: 'important',
            title: 'Optimize link order',
            description: 'Move high-performing links to the top',
            impact: 'Could increase clicks by 15-25%'
          }
        ],
        predictions: {
          potentialIncrease: '20-30%',
          timeframe: '2-4 weeks'
        }
      }
    }
  }

  // Generate SEO optimizations
  static async generateSEOOptimizations(pageData: {
    title?: string
    description?: string
    blocks: any[]
    niche?: string
  }): Promise<{
    title: string
    description: string
    keywords: string[]
    recommendations: string[]
  }> {
    const prompt = `
    Generate SEO optimizations for this LinkTree page:
    
    Current title: ${pageData.title || 'Untitled'}
    Current description: ${pageData.description || 'No description'}
    Niche: ${pageData.niche || 'General'}
    Number of blocks: ${pageData.blocks.length}
    Block types: ${pageData.blocks.map(b => b.type).join(', ')}
    
    Generate:
    1. Optimized page title (50-60 characters)
    2. Meta description (150-160 characters)
    3. Relevant keywords array
    4. SEO improvement recommendations
    
    Focus on search visibility and click-through rates.
    Return as JSON.
    
    Example:
    {
      "title": "John Doe | Content Creator & Designer",
      "description": "Discover John's latest projects, tutorials, and social content. Follow along for creative inspiration and behind-the-scenes content.",
      "keywords": ["content creator", "designer", "portfolio", "creative"],
      "recommendations": ["Add more descriptive titles to your links", "Include location-based keywords"]
    }
    
    Return ONLY the JSON object, no other text.
    `

    try {
      const content = await callGemini(prompt);
      return JSON.parse(content.trim());
    } catch (error) {
      console.error('AI SEO Optimization Error:', error);
      return {
        title: pageData.title || 'My LinkTree',
        description: pageData.description || 'All my important links in one place',
        keywords: ['linktree', 'social media', 'links'],
        recommendations: ['Add more descriptive titles to your links']
      }
    }
  }

  // Smart A/B test suggestions
  static async generateABTestSuggestions(pageData: {
    currentPerformance: any
    blocks: any[]
    theme: any
  }): Promise<{
    tests: Array<{
      name: string
      hypothesis: string
      variants: Array<{
        name: string
        changes: string[]
        expectedImpact: string
      }>
      priority: 'high' | 'medium' | 'low'
      duration: string
    }>
  }> {
    const prompt = `
    Suggest A/B tests for this LinkTree page:
    
    Current performance:
    - CTR: ${pageData.currentPerformance.ctr || 0}%
    - Bounce rate: ${pageData.currentPerformance.bounceRate || 0}%
    - Avg time on page: ${pageData.currentPerformance.avgTime || 0}s
    
    Page has ${pageData.blocks.length} blocks
    Current theme: ${pageData.theme.category || 'default'}
    
    Suggest 3-5 A/B tests with:
    1. Clear hypothesis
    2. Specific variants to test
    3. Expected impact
    4. Priority level
    5. Recommended test duration
    
    Return as JSON with tests array.
    
    Example:
    {
      "tests": [
        {
          "name": "Button Color Test",
          "hypothesis": "Brighter button colors will increase click-through rates",
          "variants": [
            {
              "name": "Bright Orange",
              "changes": ["Change primary color to #ff6b35"],
              "expectedImpact": "10-15% CTR increase"
            }
          ],
          "priority": "medium",
          "duration": "2 weeks"
        }
      ]
    }
    
    Return ONLY the JSON object, no other text.
    `

    try {
      const content = await callGemini(prompt);
      return JSON.parse(content.trim());
    } catch (error) {
      console.error('AI A/B Test Suggestions Error:', error);
      return {
        tests: [
          {
            name: 'Button Color Test',
            hypothesis: 'Brighter button colors will increase click-through rates',
            variants: [
              {
                name: 'Bright Orange',
                changes: ['Change primary color to #ff6b35'],
                expectedImpact: '10-15% CTR increase'
              }
            ],
            priority: 'medium',
            duration: '2 weeks'
          }
        ]
      }
    }
  }

  // Check AI credits and deduct
  static async useAICredits(userId: string, creditsToUse: number = 1): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { aiCredits: true, plan: true }
      })

      if (!user || user.aiCredits < creditsToUse) {
        return false
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          aiCredits: {
            decrement: creditsToUse
          }
        }
      })

      return true
    } catch (error) {
      console.error('AI Credits Error:', error)
      return false
    }
  }

  // Get AI usage analytics
  static async getAIUsage(userId: string): Promise<{
    creditsUsed: number
    creditsRemaining: number
    popularFeatures: string[]
    recommendations: string[]
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { aiCredits: true, plan: true, createdAt: true }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Calculate credits used this month (mock for now)
      const creditsUsedThisMonth = Math.max(0, 50 - user.aiCredits) // Assuming 50 monthly credits

      return {
        creditsUsed: creditsUsedThisMonth,
        creditsRemaining: user.aiCredits,
        popularFeatures: ['Bio Generation', 'Color Palette', 'Content Suggestions'],
        recommendations: [
          'Try generating a new bio to improve engagement',
          'Use AI color palette to refresh your design',
          'Get content suggestions for better conversions'
        ]
      }
    } catch (error) {
      console.error('AI Usage Analytics Error:', error)
      return {
        creditsUsed: 0,
        creditsRemaining: 0,
        popularFeatures: [],
        recommendations: []
      }
    }
  }
}
