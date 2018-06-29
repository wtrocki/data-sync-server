const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const http = require('http')
const app = express()

const HTTP_PORT = process.env.HTTP_PORT || '8000'

let SCHEMA_FILE = process.env.SCHEMA_FILE
if (SCHEMA_FILE == null || SCHEMA_FILE.length === 0) {
  console.error('SCHEMA_FILE not defined')
  process.exit(1)
}

const DATA_SOURCES_FILE = process.env.DATA_SOURCES_FILE
if (DATA_SOURCES_FILE == null || DATA_SOURCES_FILE.length === 0) {
  console.error('DATA_SOURCES_FILE not defined')
  process.exit(1)
}

let RESOLVER_MAPPINGS_FILE = process.env.RESOLVER_MAPPINGS_FILE
if (RESOLVER_MAPPINGS_FILE == null || RESOLVER_MAPPINGS_FILE.length === 0) {
  console.error('RESOLVER_MAPPINGS_FILE not defined')
  process.exit(1)
}

let schema = require('./lib/schemaParser').parseFromFile(SCHEMA_FILE, DATA_SOURCES_FILE, RESOLVER_MAPPINGS_FILE)

const server = new ApolloServer({schema})
server.applyMiddleware({app})

setTimeout(function () {
  SCHEMA_FILE = './examples/schema.example2.graphql'
  RESOLVER_MAPPINGS_FILE = './examples/resolver-mappings.example2.json'
  console.log('Reloading schema, restarting shit')
  console.log('Reloading schema, restarting shit')
  console.log('Reloading schema, restarting shit')
  console.log('Reloading schema, restarting shit')
  console.log('Reloading schema, restarting shit')
  console.log('Reloading schema, restarting shit')
  console.log('Reloading schema, restarting shit')
  console.log('Reloading schema, restarting shit')
  console.log('Reloading schema, restarting shit')

  schema = require('./lib/schemaParser').parseFromFile(SCHEMA_FILE, DATA_SOURCES_FILE, RESOLVER_MAPPINGS_FILE)

  server.schema = schema
}, 10000)

// Wrap the Express server
const ws = http.createServer(app)

ws.listen(HTTP_PORT, () => {
  console.log(`Server is now running on http://localhost:${HTTP_PORT}`)
})
