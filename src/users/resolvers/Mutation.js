const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

exports.Mutation = {
  async createUser(parent, args, { db }, info) {
    // The db is a mongoose connection passed as context from index.js file. In the absence of mongoose schema, db.collection('<collection_name>') must be used to work with the collection.
    // The findOne method is a mongoose method which returns the first object in the collection which matches the criteria e.g. { email: args.data.email }
    const emailTaken = await db.collection('users').findOne({ email: args.data.email })

    if (emailTaken) {
      throw new Error('Email taken')
    }

    const user = {
      ...args.data
    }

    // The db is a mongoose connection passed as context from index.js file. In the absence of mongoose schema, db.collection('<collection_name>') must be used to work with the collection.
    // The insertOne method saves the object to the collection.
    const result = await db.collection('users').insertOne(user)

    const [createdUser] = result.ops

    return createdUser
  },
  async updateUser(parent, args, { db }, info) {
    let { _id, data } = args

    // The GraphQL ID type is not recognised by MongoDB. It has to be converted to ObjectId type. 
    _id = mongoose.Types.ObjectId(_id)

    // The db is a mongoose connection passed as context from index.js file. In the absence of mongoose schema, db.collection('<collection_name>') must be used to work with the collection.
    // It is recommended that findById method be used when running a query with _id. However, FindById doesn't work with db.collection('<collection_name>').
    // The findOne method is a mongoose method which returns the first object in the collection which matches the criteria e.g. { _id }
    const user = await db.collection('users').findOne({ _id })

    if (!user) {
      throw new Error('User not found')
    }

    // The typeof command is used here to check whether the property email has a value which is of type string. In other words typeof command is used to check whether user has provided an email input.
    if (typeof data.email === 'string') {
      const emailTaken = await db.collection('users').findOne({ email: args.data.email })
      if (emailTaken) {
        throw new Error('Email is in use')
      }

      await db.collection('users').updateOne({ _id }, { $set: { email: data.email } })
    }

    // The typeof command is used to check whether user has provided a name input.
    if (typeof data.name === 'string') {
      await db.collection('users').updateOne({ _id }, { $set: { name: data.name } })
    }

    // The typeof command is used to check whether user has provided an age input.
    if (typeof data.age !== 'undefined') {
      await db.collection('users').updateOne({ _id }, { $set: { age: data.age } })
    }

    return await db.collection('users').findOne({ _id })
  },
  async deleteUser(parent, args, { db }, info) {
    const _id = mongoose.Types.ObjectId(args._id)

    const user = await db.collection('users').findOneAndDelete({ _id })

    if (!user) {
      throw new Error('User not found')
    }

    // The findOneAndDelete method provides an object with a property called value. This value property has the details of the deleted user.
    return user.value
  },
  async login(parent, { email, password }, { db }, info) {
    const { _id, roles, permissions } = await db.collection('users').findOne({ email, password })

    const id = _id.toString()

    return jwt.sign(
      { "https://awesomeapi.com/graphql": { roles, permissions } },
      "secret",
      { algorithm: "HS256", subject: id, expiresIn: "1d" }
    )
  }
}