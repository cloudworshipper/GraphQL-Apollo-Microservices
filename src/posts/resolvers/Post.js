const mongoose = require('mongoose')

const { db } = require('../../connector')

exports.Post = {
  async _resolveReference(post) {
    const _id = mongoose.Types.ObjectId(post._id)

    return await db.collection('posts').findOne({ _id })
  },
}