const mongoose = require('mongoose')

const { db } = require('../../connector')

exports.Post = {
  async author(args) {
    const _id = mongoose.Types.ObjectId(args._id)

    const { author } = await (await db).collection('posts').findOne({ _id })

    return await (await db).collection('users').findOne({ _id: author })
  }
}