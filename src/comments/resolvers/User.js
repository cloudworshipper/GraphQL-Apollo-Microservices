const mongoose = require('mongoose')

const { db } = require('../../connector')

exports.User = {
  async comments(args) {
    const _id = mongoose.Types.ObjectId(args._id)

    return await (await db).collection('comments').find({ author: _id }).toArray()
  }
  // Define methods for roles and permissions
}