const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const graphql = require('graphql')
const http = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const cors = require('cors')
const app = express()
const fs = require('fs')

setInterval(function () {
  console.log('process.memoryUsage', JSON.stringify(process.memoryUsage()))
}, 1000)
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

// const schema = require('./lib/schemaParser').parseFromFile(SCHEMA_FILE, DATA_SOURCES_FILE, RESOLVER_MAPPINGS_FILE)

var schema = require('./lib/schemaParser').parseFromFile(SCHEMA_FILE, DATA_SOURCES_FILE, RESOLVER_MAPPINGS_FILE)
const tracing = true
app.use('/graphql', bodyParser.json(), function (req, res, next) {
  const graphql = graphqlExpress({ schema, tracing })
  graphql(req, res, next)
})

setInterval(() => {
  schema = require('./lib/schemaParser').parseFromFile(SCHEMA_FILE + '.2', DATA_SOURCES_FILE, RESOLVER_MAPPINGS_FILE + '.2')
}, 1000)

// setTimeout(function() {
//   var routes = app._router.stack;
//   routes.forEach(removeMiddlewares);
//   function removeMiddlewares(route, i, routes) {
//     if (route.handle.name === 'graphqlHandler') {
//       // unmount
//       routes.splice(i, 1);
//       // remount
//       const schema2 = require('./lib/schemaParser').parseFromFile(SCHEMA_FILE + '.2', DATA_SOURCES_FILE, RESOLVER_MAPPINGS_FILE + '.2')
//       app.use('/graphql', graphqlExpress({ schema2, tracing }))
//       console.log('REMOUNTED');
//     }
//     if (route.route)
//         route.route.stack.forEach(removeMiddlewares);
//   }
// }, 10000);

var graphiqlConfig = {
  endpointURL: '/graphql', // if you want GraphiQL enabled
  subscriptionsEndpoint: `ws://localhost:${HTTP_PORT}/subscriptions`
}
const QUERY_FILE = process.env.QUERY_FILE
if (QUERY_FILE && QUERY_FILE.length > 0) {
  graphiqlConfig.query = fs.readFileSync(QUERY_FILE).toString()
}

// TODO Move this to the Admin UI
app.get('/graphiql', graphiqlExpress(graphiqlConfig))

// Wrap the Express server
const ws = http.createServer(app)

ws.listen(HTTP_PORT, () => {
  console.log(`Server is now running on http://localhost:${HTTP_PORT}`)
  // Set up the WebSocket for handling GraphQL subscriptions
  // eslint-disable-next-line
  new SubscriptionServer({
    execute: graphql.execute,
    subscribe: graphql.subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions'
  })
})
