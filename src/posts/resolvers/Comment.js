const mongoose = require('mongoose')

const { db } = require('../../connector')

exports.Comment = {
  async post(args) {
    const _id = mongoose.Types.ObjectId(args._id)

    const { post } = await (await db).collection('comments').findOne({ _id })

    return await (await db).collection('posts').findOne({ _id: post })
  }
}