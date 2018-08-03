'use strict'

const { schema, subscriptions } = require('./memeolist-example-shared')

const time = new Date()

const datasources = [
  {
    id: 1,
    name: 'nedb_postgres',
    type: 'Postgres',
    config: `{"options":{
      "user": "postgresql",
      "password": "postgres",
      "database": "memeolist_db",
      "host": "127.0.0.1",
      "port": "15432",
      "dialect": "postgres"
    }}`,
    createdAt: time,
    updatedAt: time
  }
]

const resolvers = [
  {
    type: 'Meme',
    field: 'comments',
    DataSourceId: 1,
    GraphQLSchemaId: 1,
    requestMapping: `SELECT * FROM Comment WHERE memeid='{{context.parent.id}}'`,
    responseMapping: '{{ toJSON (convertNeDBIds context.result) }}',
    createdAt: time,
    updatedAt: time
  },
  {
    type: 'Query',
    field: 'allMemes',
    DataSourceId: 1,
    GraphQLSchemaId: 1,
    preHook: 'http://www.google.com',
    postHook: 'http://www.redhat.com',
    requestMapping: 'SELECT * FROM Meme',
    responseMapping: '{{ toJSON context.result }}',
    publish: JSON.stringify({
      topic: 'memeCreated',
      payload: `{
        "memeAdded": {{ toJSON context.result }}
      }`
    }),
    createdAt: time,
    updatedAt: time
  },
  {
    type: 'Query',
    field: 'profile',
    DataSourceId: 1,
    GraphQLSchemaId: 1,
    requestMapping: `SELECT * FROM Profile WHERE email='{{context.arguments.email}}'`,
    responseMapping: '{{ toJSON context.result }}',
    createdAt: time,
    updatedAt: time
  },
  {
    type: 'Mutation',
    field: 'createMeme',
    DataSourceId: 1,
    GraphQLSchemaId: 1,
    requestMapping: `INSERT INTO Meme ("ownerid","photourl", "owner", "likes") VALUES ('{{context.arguments.ownerid}}','{{context.arguments.photourl}}', '{{context.arguments.owner}}', 0) RETURNING *;`,
    responseMapping: '{{ toJSON context.result.[0] }}',
    publish: JSON.stringify({
      topic: 'memeCreated',
      payload: `{
        "memeAdded": {{ toJSON context.result }}
      }`
    }),
    createdAt: time,
    updatedAt: time
  },
  {
    type: 'Mutation',
    field: 'createProfile',
    DataSourceId: 1,
    GraphQLSchemaId: 1,
    requestMapping: `INSERT INTO Profile ("email", "displayname", "pictureurl") VALUES ('{{context.arguments.email}}','{{context.arguments.displayname}}','{{context.arguments.pictureUrl}}') RETURNING *;`,
    responseMapping: '{{ toJSON context.result.[0] }}',
    createdAt: time,
    updatedAt: time
  },
  {
    type: 'Mutation',
    field: 'likeMeme',
    DataSourceId: 1,
    GraphQLSchemaId: 1,
    requestMapping: `UPDATE Meme SET likes=likes+1 WHERE id={{context.arguments.id}} RETURNING *;`,
    responseMapping: 'true',
    createdAt: time,
    updatedAt: time
  }, {
    type: 'Mutation',
    field: 'postComment',
    DataSourceId: 1,
    GraphQLSchemaId: 1,
    requestMapping: `INSERT INTO Comment ("comment", "owner", "memeid") VALUES ('{{context.arguments.comment}}','{{context.arguments.owner}}','{{context.arguments.memeid}}') RETURNING *;`,
    responseMapping: '{{ toJSON context.result.[0] }}',
    createdAt: time,
    updatedAt: time
  }
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('DataSources', datasources, {})
    await queryInterface.bulkInsert('GraphQLSchemas', [schema], {})
    await queryInterface.bulkInsert('Subscriptions', subscriptions, {})
    return queryInterface.bulkInsert('Resolvers', resolvers, {})
  }
}
