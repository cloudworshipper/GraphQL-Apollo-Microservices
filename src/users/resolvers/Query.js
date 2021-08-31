const mongoose = require('mongoose')

exports.Query = {
  async users(parent, args, { db }, info) {
    if (!args.query) {
      // The find().toArray() returns an array which conforms to [User!]! output defined in GraphQL Query schema.
      return await db.collection('users').find().toArray()
    }

    const name = args.query.toLowerCase()

    // The find(({ name }).toArray() returns an array which conforms to [User!]! output defined in GraphQL Query schema. When findOne(({ name }) is used, it returns a single object which does not conform to the above mentioned Query schema which results in an error.
    return await db.collection('users').find({ name }).toArray()
  },
  async user(parent, args, { db }, info) {
    const _id = mongoose.Types.ObjectId(args._id)

    return await db.collection('users').findOne({ _id })
  },
  async me(parent, args, { db, user }, info) {
    const _id = mongoose.Types.ObjectId(user.sub)
    return await db.collection('users').findOne({ _id })
  },
  // me() {
  //   return {
  //     id: 'abc123',
  //     name: 'Some Name',
  //     email: 'somename@someemail.com',
  //     age: 50
  //   }
  // },
}