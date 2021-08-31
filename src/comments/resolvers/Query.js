exports.Query = {
  async comments(parent, args, { db }, info) {
    return await db.collection('comments').find().toArray()
  },
}