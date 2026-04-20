export interface PaletteComponent {
  id: string
  label: string
  category: string
  color: string
}

export const paletteComponents: PaletteComponent[] = [
  // Frontend
  { id: 'client', label: 'Client', category: 'Frontend', color: '#6366f1' },
  { id: 'cdn', label: 'CDN', category: 'Frontend', color: '#8b5cf6' },
  { id: 'mobile-app', label: 'Mobile App', category: 'Frontend', color: '#a78bfa' },

  // Networking
  { id: 'load-balancer', label: 'Load Balancer', category: 'Networking', color: '#3b82f6' },
  { id: 'api-gateway', label: 'API Gateway', category: 'Networking', color: '#0ea5e9' },
  { id: 'dns', label: 'DNS', category: 'Networking', color: '#06b6d4' },

  // Compute
  { id: 'app-server', label: 'App Server', category: 'Compute', color: '#10b981' },
  { id: 'worker', label: 'Worker', category: 'Compute', color: '#34d399' },
  { id: 'serverless', label: 'Serverless Function', category: 'Compute', color: '#6ee7b7' },

  // Storage
  { id: 'sql-db', label: 'SQL DB', category: 'Storage', color: '#f59e0b' },
  { id: 'nosql-db', label: 'NoSQL DB', category: 'Storage', color: '#fbbf24' },
  { id: 'object-store', label: 'Object Store', category: 'Storage', color: '#fcd34d' },
  { id: 'data-warehouse', label: 'Data Warehouse', category: 'Storage', color: '#fde68a' },

  // Cache
  { id: 'redis-cache', label: 'Redis Cache', category: 'Cache', color: '#ef4444' },
  { id: 'cdn-cache', label: 'CDN Cache', category: 'Cache', color: '#f87171' },
  { id: 'in-memory-cache', label: 'In-Memory Cache', category: 'Cache', color: '#fca5a5' },

  // Messaging
  { id: 'message-queue', label: 'Message Queue', category: 'Messaging', color: '#ec4899' },
  { id: 'event-bus', label: 'Event Bus', category: 'Messaging', color: '#f472b6' },
  { id: 'pub-sub', label: 'Pub/Sub', category: 'Messaging', color: '#f9a8d4' },

  // Infrastructure
  { id: 'firewall', label: 'Firewall', category: 'Infrastructure', color: '#64748b' },
  { id: 'rate-limiter-node', label: 'Rate Limiter', category: 'Infrastructure', color: '#94a3b8' },
  { id: 'search-engine', label: 'Search Engine', category: 'Infrastructure', color: '#cbd5e1' },
]

export const categories = [
  'Frontend',
  'Networking',
  'Compute',
  'Storage',
  'Cache',
  'Messaging',
  'Infrastructure',
] as const

export function getComponentsByCategory(category: string): PaletteComponent[] {
  return paletteComponents.filter((c) => c.category === category)
}
