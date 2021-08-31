const mongoose = require('mongoose')

const { db } = require('../../connector')

exports.Post = {
  async comments(args) {
    const _id = mongoose.Types.ObjectId(args._id)

    return await (await db).collection('comments').find({ post: _id }).toArray()
  },
}