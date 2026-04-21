import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const gradeRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60s'),
  prefix: 'rl:grade',
})

export const hintRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '60s'),
  prefix: 'rl:hint',
})
