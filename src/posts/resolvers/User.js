const mongoose = require('mongoose')

const { db } = require('../../connector')

exports.User = {
  async posts(args) {
    const _id = mongoose.Types.ObjectId(args._id)

    return await (await db).collection('posts').find({ author: _id }).toArray()
  }
}