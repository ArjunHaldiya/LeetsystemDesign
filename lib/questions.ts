import { Question } from './types'

export const questions: Question[] = [
  {
    id: 'url-shortener',
    title: 'Design a URL Shortener',
    company: 'Meta',
    difficulty: 'medium',
    description: 'Design a service like bit.ly that takes a long URL and returns a short alias. The short URL should redirect to the original URL when visited.',
    requirements: {
      functional: [
        'Generate a unique short URL for a given long URL',
        'Redirect short URL to the original long URL',
        'Support custom aliases',
        'Track click analytics (count, timestamp, location)',
        'URLs expire after a configurable TTL',
      ],
      nonFunctional: [
        '100M URLs created per day (~1200/sec writes)',
        '10B redirects per day (~115K/sec reads)',
        'Read:write ratio 100:1',
        'Redirection latency < 10ms (p99)',
        '99.99% availability',
        'Short URLs are 7 characters (base62)',
      ],
    },
    rubric: {
      required: [
        'Load Balancer',
        'App Server',
        'SQL DB or NoSQL DB',
        'Cache (Redis)',
        'DNS',
      ],
      recommended: [
        'CDN',
        'Message Queue',
        'Worker',
        'Object Store',
      ],
      connections: [
        { from: 'Client', to: 'DNS' },
        { from: 'DNS', to: 'Load Balancer' },
        { from: 'Load Balancer', to: 'App Server' },
        { from: 'App Server', to: 'Cache' },
        { from: 'App Server', to: 'SQL DB' },
        { from: 'App Server', to: 'NoSQL DB' },
      ],
    },
  },
  {
    id: 'rate-limiter',
    title: 'Design a Rate Limiter',
    company: 'Google',
    difficulty: 'medium',
    description: 'Design a distributed rate limiter that limits the number of requests a client can make to an API within a time window, preventing abuse and ensuring fair usage.',
    requirements: {
      functional: [
        'Limit requests per user/IP per time window',
        'Support multiple algorithms: token bucket, sliding window, fixed window',
        'Return 429 Too Many Requests when limit exceeded',
        'Different rate limits for different API endpoints',
        'Real-time limit status in response headers',
      ],
      nonFunctional: [
        'Decision latency < 1ms (added overhead)',
        '1M requests per second throughput',
        'Accurate across distributed nodes',
        'No single point of failure',
        '99.999% availability',
      ],
    },
    rubric: {
      required: [
        'Load Balancer',
        'App Server',
        'Redis Cache',
        'API Gateway',
      ],
      recommended: [
        'Message Queue',
        'Worker',
        'SQL DB',
        'Firewall',
      ],
      connections: [
        { from: 'Client', to: 'API Gateway' },
        { from: 'API Gateway', to: 'Load Balancer' },
        { from: 'Load Balancer', to: 'App Server' },
        { from: 'App Server', to: 'Redis Cache' },
        { from: 'API Gateway', to: 'Redis Cache' },
      ],
    },
  },
  {
    id: 'news-feed',
    title: 'Design a News Feed',
    company: 'Meta',
    difficulty: 'hard',
    description: 'Design a personalized news feed system like Facebook or Twitter. Users can post content, follow others, and see a ranked feed of posts from people they follow.',
    requirements: {
      functional: [
        'Users can create posts (text, images, videos)',
        'Users can follow/unfollow other users',
        'Feed shows ranked posts from followed users',
        'Support likes, comments, and shares',
        'Real-time updates when new posts arrive',
        'Infinite scroll pagination',
      ],
      nonFunctional: [
        '500M daily active users',
        'Each user sees feed of up to 500 posts',
        'Feed generation < 200ms (p99)',
        'Write fanout for users with <10K followers (push model)',
        'Pull model for celebrity accounts (>10K followers)',
        '99.9% availability',
        'Posts are eventually consistent (2-3 seconds lag acceptable)',
      ],
    },
    rubric: {
      required: [
        'Load Balancer',
        'App Server',
        'SQL DB',
        'NoSQL DB',
        'Cache (Redis)',
        'Message Queue',
        'CDN',
      ],
      recommended: [
        'Worker',
        'Object Store',
        'Search Engine',
        'Event Bus',
        'API Gateway',
      ],
      connections: [
        { from: 'Client', to: 'CDN' },
        { from: 'Client', to: 'Load Balancer' },
        { from: 'Load Balancer', to: 'App Server' },
        { from: 'App Server', to: 'Cache' },
        { from: 'App Server', to: 'SQL DB' },
        { from: 'App Server', to: 'NoSQL DB' },
        { from: 'App Server', to: 'Message Queue' },
        { from: 'Message Queue', to: 'Worker' },
        { from: 'Worker', to: 'Cache' },
        { from: 'Worker', to: 'Object Store' },
      ],
    },
  },
]

export function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id)
}
