const { gql } = require('apollo-server')

// Define Types, Queries and Mutations for Role and Permission
// Add mutation for password updation
// Setup permissions for updating user details
// Setup permissions for updating password

// Very Important: single quotes (') are not allowed in GraphQL schema

exports.typeDefs = gql`
type User @key(fields: "_id") {
  _id: ID!
  name: String!
  email: String!
  age: Int
  roles: [String]
  permissions: [String]
}
extend type Post @key(fields: "_id") {
  _id: ID! @external
  author: User! @requires(fields: "_id")
}
extend type Comment @key(fields: "_id") {
  _id: ID! @external
  author: User! @requires(fields: "_id")
}
extend type Query {
  users(query: String): [User!]!
  user(_id: ID!): User!
  me: User!
}
extend type Mutation {
  createUser(data: CreateUserInput): User!
  updateUser(_id: ID!, data: UpdateUserInput): User!
  deleteUser(_id: ID!): User!
  login(email: String!, password: String!): String
}
input CreateUserInput {
  name: String!
  email: String!
  age: Int
  password: String!
  roles: [String!]!
  permissions: [String!]!
}
input UpdateUserInput {
  name: String
  email: String
  age: Int
  password: String
  roles: [String]
  permissions: [String]
}
`