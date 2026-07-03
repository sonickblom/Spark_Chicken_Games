import 'dotenv/config'
import Fastify from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { PrismaClient } from '@prisma/client'

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty',
      options: { colorize: true }
    } : undefined
  }
}).withTypeProvider<ZodTypeProvider>()

const prisma = new PrismaClient()

// Plugins
await app.register(helmet, {
  contentSecurityPolicy: process.env.NODE_ENV === 'production'
})

await app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
})

await app.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000')
})

await app.register(swagger, {
  openapi: {
    info: {
      title: 'Spark Chicken Games API',
      description: 'API documentation for Spark Chicken Games',
      version: '1.0.0'
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3001}`, description: 'Development server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
})

await app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true
  }
})

// Health check
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// API Routes
app.get('/api', async () => {
  return { message: 'Welcome to Spark Chicken Games API', version: '1.0.0' }
})

// Example route with validation
import { z } from 'zod'

const createGameSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    genre: z.string().optional(),
    releaseDate: z.string().datetime().optional()
  })
})

app.post('/api/games', { schema: createGameSchema }, async (request, reply) => {
  const { title, description, genre, releaseDate } = request.body

  const game = await prisma.game.create({
    data: {
      title,
      description,
      genre,
      releaseDate: releaseDate ? new Date(releaseDate) : null
    }
  })

  return reply.status(201).send(game)
})

app.get('/api/games', async () => {
  const games = await prisma.game.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return games
})

app.get('/api/games/:id', async (request, reply) => {
  const { id } = request.params as { id: string }

  const game = await prisma.game.findUnique({ where: { id } })

  if (!game) {
    return reply.status(404).send({ message: 'Game not found' })
  }

  return game
})

// Graceful shutdown
const shutdown = async () => {
  app.log.info('Shutting down...')
  await prisma.$disconnect()
  await app.close()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// Start server
const start = async () => {
  try {
    await app.listen({
      port: parseInt(process.env.PORT || '3001'),
      host: process.env.HOST || '0.0.0.0'
    })

    console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3001}`)
    console.log(`📚 API Docs at http://localhost:${process.env.PORT || 3001}/docs`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
