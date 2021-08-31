const mongoose = require('mongoose')

const { db } = require('../../connector')

exports.Comment = {
  async author(args) {
    const _id = mongoose.Types.ObjectId(args._id)

    const { author } = await (await db).collection('comments').findOne({ _id })

    return await (await db).collection('users').findOne({ _id: author })
  }
}