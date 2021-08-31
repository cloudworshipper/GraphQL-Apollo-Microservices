const mongoose = require('mongoose')

exports.Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const _id = mongoose.Types.ObjectId(postId)

      // const post = db.posts.find(post => post.id === postId && post.published)
      const post = db.collection('posts').findOne({ _id, published: true })

      if (!post) {
        throw new Error('Post not found')
      }

      return pubsub.asyncIterator(`Comment ${_id}`)
    }
  },
}