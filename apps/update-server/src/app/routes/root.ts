import {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
  type RouteShorthandOptionsWithHandler
} from 'fastify'

interface AppInfo {
  platform: string,
  device_id: string,
  app_id: string,
  custom_id: string,
  plugin_version: string,
  version_build: string,
  version_code: 'builtin' | string,
  version_name: string,
  version_os: string,
  is_emulator: boolean,
  is_prod: boolean,
  defaultChannel: string
}

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return { message: 'Hello API' }
  })

  const opts: RouteShorthandOptionsWithHandler = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            version: { type: 'string' },
            url: { type: 'string' }
          }
        }
      }
    },
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      const appInfo = request.body as AppInfo
      console.log('BOSH: root: request.appInfo:', appInfo)

      reply.send({
        version: '0.0.3',
        url: 'https://github.com/Cap-go/demo-app/releases/download/0.0.3-v4/dist.zip'
      })
    }
  }

  fastify.post('/update', opts)
}
