const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const http = require('http')
const cors = require('cors')
const app = express()

app.use('*', cors())

const HTTP_PORT = process.env.HTTP_PORT || '8000'

const SCHEMA_FILE = process.env.SCHEMA_FILE
if (SCHEMA_FILE == null || SCHEMA_FILE.length === 0) {
  console.error('SCHEMA_FILE not defined')
  process.exit(1)
}

const DATA_SOURCES_FILE = process.env.DATA_SOURCES_FILE
if (DATA_SOURCES_FILE == null || DATA_SOURCES_FILE.length === 0) {
  console.error('DATA_SOURCES_FILE not defined')
  process.exit(1)
}

const RESOLVER_MAPPINGS_FILE = process.env.RESOLVER_MAPPINGS_FILE
if (RESOLVER_MAPPINGS_FILE == null || RESOLVER_MAPPINGS_FILE.length === 0) {
  console.error('RESOLVER_MAPPINGS_FILE not defined')
  process.exit(1)
}

const schema = require('./lib/schemaParser').parseFromFile(SCHEMA_FILE, DATA_SOURCES_FILE, RESOLVER_MAPPINGS_FILE)

const server = new ApolloServer({schema})

server.applyMiddleware({
  app,
  gui: {
    endpoint: '/graphql',
    subscriptionEndpoint: `ws://localhost:${HTTP_PORT}/subscriptions`
  }
})

// TODO Move this to the Admin UI
// app.get('/graphiql', graphiqlExpress(graphiqlConfig))

// Wrap the Express server
const ws = http.createServer(app)

ws.listen(HTTP_PORT, () => {
  console.log(`Server is now running on http://localhost:${HTTP_PORT}`)
})
