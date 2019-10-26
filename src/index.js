import 'dotenv/config'
import cors from 'cors'
import morgan from 'morgan'
import http from 'http'
import DataLoader from 'dataloader'
import express from 'express'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { sequelize } from './models/index'
import loaders from './loaders'

const app = express()

app.use(cors())

app.use(morgan('dev'))

import resolve from './resolvers/authentication/github'

const getLoggedInUser = async req => {
  if (req.isAuthenticated()) {
    return req.user
  } else {
    throw new AuthenticationError('Your session expired. Sign in again.')
  }
}

const context = async ({ req, connection }) => {
  if (connection) {
    return {
      models,
      loaders: {
        user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
      }
    };
  }

  if (req) {
    const loggedInUser = await getLoggedInUser(req);

    return {
      models,
      loggedInUser,
      secret: process.env.JWT_SECRET,
      loaders: {
        user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
      }
    };
  }
};

resolve(app);

const server = new ApolloServer({
  introspection: true,
  playground: true, //!!!process.env.PRODUCTION,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '')
    return {
      ...error,
      message
    }
  },
  context
})

server.applyMiddleware({ app, path: '/graphql' })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

const isTest = !!!process.env.PRODUCTION
const isProduction = !!process.env.PRODUCTION
const port = process.env.PORT || 8000

sequelize.sync({ force: isTest }).then(async () => {
  if (isTest) {
    // createUsersWithMessages(new Date())
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`)
  })
})
