const { gql } = require('apollo-server')

// Copy Subscription type

exports.typeDefs = gql`
type Post @key(fields: "_id") {
  _id: ID!
  title: String!
  body: String!
  published: Boolean!
}
extend type User @key(fields:"_id") {
  _id: ID! @external
  posts:[Post!]! @requires(fields:"_id")
}
extend type Comment @key(fields:"_id") {
  _id: ID! @external
  post: Post! @requires(fields:"_id")
}
extend type Query {
  posts(query: String): [Post!]!
  post: Post!
}
extend type Mutation {
  createPost(data: CreatePostInput!): Post!
  updatePost(_id: ID!, data: UpdatePostInput!): Post!
  deletePost(_id: ID!): Post!
}
input CreatePostInput {
  title: String!
  body: String!
  published: Boolean!
  author: ID!
}
input UpdatePostInput {
  title: String
  body: String
  published: Boolean
}
enum MutationType {
  CREATED
  UPDATED
  DELETED
}
type PostSubscriptionPayload {
  mutation: MutationType!
  data: Post!
}

`