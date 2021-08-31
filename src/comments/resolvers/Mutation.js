const mongoose = require('mongoose')

exports.Mutation = {
  async createComment(parent, args, { db, pubsub }, info) {
    let { text, author, post } = args.data

    author = mongoose.Types.ObjectId(author)
    post = mongoose.Types.ObjectId(post)

    // const userExists = db.users.some(user => user.id === args.data.author)
    const userExists = await db.collection('users').findOne({ _id: author })

    if (!userExists) {
      throw new Error('User not found')
    }

    // const postExists = db.posts.some(post => post.id === args.data.post && post.published)
    const postExists = await db.collection('posts').findOne({ _id: post, published: true })

    if (!postExists) {
      throw new Error('Post not found')
    }

    const comment = {
      // id: uuidv4(),
      text, author, post
    }

    // db.comments.push(comment)
    const result = await db.collection('comments').insertOne(comment)
    const [createdComment] = result.ops

    io.getIO().emit(`comment ${post}`, {
      action: 'create',
      comment: { ...createdComment }
    })

    // pubsub.publish(`Comment ${post}`, {
    //   comment: {
    //     mutation: 'CREATED',
    //     data: createdComment
    //   }
    // })

    return createdComment
  },
  async updateComment(parent, args, { db, pubsub }, info) {
    let { _id, data } = args
    let updatedComment

    _id = mongoose.Types.ObjectId(_id)

    // const comment = db.comments.find(comment => comment.id === id)
    const comment = await db.collection('comments').findOne({ _id })

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
      await db.collection('comments').updateOne({ _id }, { $set: { ...comment } })

      updatedComment = await db.collection('comments').findOne({ _id })

      io.getIO().emit(`comment ${updatedComment.post}`, {
        action: 'update',
        comment: { ...updatedComment._doc }
      })

      // pubsub.publish(`Comment ${updatedComment.post}`, {
      //   comment: {
      //     mutation: 'UPDATED',
      //     data: updatedComment
      //   }
      // })
    }

    return updatedComment
  },
  async deleteComment(parent, args, { db, pubsub }, info) {
    const _id = mongoose.Types.ObjectId(args._id)

    // const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

    // const [deletedComment] = db.comments.splice(commentIndex, 1)

    const deletedComment = await db.collection('comments').findOneAndDelete({ _id })

    io.getIO().emit(`comment ${deletedComment.value.post}`, {
      action: 'delete',
      comment: { ...deletedComment.value }
    })

    // pubsub.publish(`Comment ${deletedComment.value.post}`, {
    //   comment: {
    //     mutation: 'DELETED',
    //     data: deletedComment.value
    //   }
    // })

    return deletedComment.value
  }
}