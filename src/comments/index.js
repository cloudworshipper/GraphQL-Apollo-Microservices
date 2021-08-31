const { ApolloServer, PubSub } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')
const { applyMiddleware } = require('graphql-middleware')

const { typeDefs } = require('./schema')
const { Comment } = require('./resolvers/Comment')
const { User } = require('./resolvers/User')
const { Post } = require('./resolvers/Post')
const { Query } = require('./resolvers/Query')
const { Mutation } = require('./resolvers/Mutation')
const { db } = require('../connector')
const { permissions } = require('./permissions')

const pubsub = new PubSub()
const port = 4003

const server = new ApolloServer({
  schema: applyMiddleware(
    buildFederatedSchema([{
      typeDefs,
      resolvers: {
        Comment,
        User,
        Post,
        Query,
        Mutation
      }
    }]),
    permissions
  ),
  context:
    ({ req }) => {
      const user = req.headers.user ? JSON.parse(req.headers.user) : null
      return { user, db }
    },
})

server.listen({ port }).then(({ url }) => {
  console.log(`Comments service ready at ${url}`)
})



/*
import { ApolloServer, PubSub } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools'

import db from './connector'
import typeDefs from './schema'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const pubsub = new PubSub()

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  }
})

const server = new ApolloServer({
  schema,
  context: {
    db,
    pubsub
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
*/


