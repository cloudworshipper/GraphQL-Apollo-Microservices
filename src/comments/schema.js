const { gql } = require('apollo-server')

// Add Subscription type

exports.typeDefs = gql`
type Comment @key(fields: "_id") {
  _id: ID!
  text: String!
}
extend type User @key(fields: "_id") {
  _id: ID! @external
  comments: [Comment!]! @requires(fields: "_id")
}
extend type Post @key(fields:"_id") {
  _id: ID! @external
  comments: [Comment!]! @requires(fields: "_id")
}
extend type Query {
  comments: [Comment!]!
}
extend type Mutation {
  createComment(data: CreateCommentInput): Comment!
  updateComment(_id: ID!, data: UpdateCommentInput!): Comment!
  deleteComment(_id: ID!): Comment!
}
input CreateCommentInput {
  text: String!
  author: ID!
  post: ID!
}
input UpdateCommentInput {
  text: String
}
enum MutationType {
  CREATED
  UPDATED
  DELETED
}
type CommentSubscriptionPayload {
  mutation: MutationType!
  data: Comment!
}

`