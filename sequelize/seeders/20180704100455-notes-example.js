'use strict'

const time = new Date()

const datasources = [
  {
    name: 'memeolist',
    type: 'InMemory',
    config: '{"options":{"timestampData":true}}',
    createdAt: time,
    updatedAt: time
  }
]

const notesSchema = {
  schema: `
  
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  # The query type, represents all of the entry points into our object graph
  type Query {
    allMemes(orderBy: MemeOrderBy): [Meme]
  }

  # The mutation type, represents all updates we can make to our data
  type Mutation {
    createMeme(photoUrl: String!): Meme    
  }
  
  type Subscription {
    _:Boolean
  }
  
  type Meme {
    _id: ID! @isUnique
    photoUrl: String!
    votes: Int
  }
  
  enum MemeOrderBy {
    id_ASC
    id_DESC
    photoUrl_ASC
    photoUrl_DESC
    votes_ASC
    votes_DESC
  }
  
  `,
  createdAt: time,
  updatedAt: time
}

const resolvers = [
  {
    type: 'Query',
    field: 'allMemes',
    DataSourceId: 1,
    requestMapping: '{"operation": "find","query": {}}',
    responseMapping: '{{toJSON context.result}}',
    createdAt: time,
    updatedAt: time
  },
  {
    type: 'Mutation',
    field: 'createMeme',
    DataSourceId: 1,
    requestMapping: '{"operation": "insert","doc": {"photoUrl": "{{context.arguments.photoUrl}}","votes": "{{context.arguments.votes}}"}}',
    responseMapping: '{{toJSON context.result}}',
    createdAt: time,
    updatedAt: time
  }
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('DataSources', datasources, {})
    await queryInterface.bulkInsert('GraphQLSchemas', [notesSchema], {})
    return queryInterface.bulkInsert('Resolvers', resolvers, {})
  }
}
