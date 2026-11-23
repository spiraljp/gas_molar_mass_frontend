import { writeFile } from 'node:fs/promises'
const response = await fetch(process.env.OPENAPI_URL || 'http://127.0.0.1:8000/openapi.json')
if (!response.ok) throw new Error(`OpenAPI: HTTP ${response.status}`)
const schema = await response.json()
if (!schema.openapi || !schema.paths?.['/api/gases']) throw new Error('Unexpected gas API schema')
await writeFile('docs/openapi.json', `${JSON.stringify(schema, null, 2)}\n`)
