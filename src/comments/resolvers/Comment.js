const mongoose = require('mongoose')

const { db } = require('../../connector')

exports.Comment = {
  async _resolveReference(comment) {
    const _id = mongoose.Types.ObjectId(comment._id)

    return await db.collection('posts').findOne({ _id })
  },
}