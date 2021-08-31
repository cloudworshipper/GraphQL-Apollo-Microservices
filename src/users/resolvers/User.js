const mongoose = require('mongoose')

const { db } = require('../../connector')

exports.User = {
  async _resolveReference(user) {
    const _id = mongoose.Types.ObjectId(user._id)

    return await db.collection('users').findOne({ _id })
  },
}