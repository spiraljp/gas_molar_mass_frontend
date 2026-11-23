import { generateApi } from 'swagger-typescript-api'
import { resolve } from 'node:path'
await generateApi({
  input: resolve('docs/openapi.json'),
  output: resolve('src/api/generated'),
  fileName: 'Api.ts',
  httpClientType: 'axios',
  generateClient: true,
  hooks: { onCreateRoute(route) {
    if (!route.raw.route.startsWith('/api/gases')) return false
    return route
  } },
})
