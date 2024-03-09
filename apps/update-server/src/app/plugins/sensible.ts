import sensible from '@fastify/sensible'
import { type FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

/**
 * These plugins add some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(sensible)
})
