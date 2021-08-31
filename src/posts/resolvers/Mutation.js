const mongoose = require('mongoose')

const io = require('../../socket')

exports.Mutation = {
  async createPost(parent, args, { db, pubsub }, info) {
    // const userExists = db.users.some(user => user.id === args.data.author)
    const author = mongoose.Types.ObjectId(args.data.author)
    const userExists = await db.collection('users').findOne({ _id: author })
    // console.log("user exists: ", userExists)

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = {
      // id: uuidv4(),
      ...args.data, author
    }

    // db.posts.push(post)
    const result = await db.collection('posts').insertOne(post)
    const [createdPost] = result.ops
    // console.log(createdPost)

    if (args.data.published) {
      io.getIO().emit('post', {
        action: 'create',
        post: { ...createdPost }
      })
      // pubsub.publish('post', {
      //   post: {
      //     mutation: 'CREATED',
      //     data: createdPost
      //   }
      // })
    }

    return createdPost
  },
  async updatePost(parent, args, { db, pubsub }, info) {
    let { _id, data } = args

    _id = mongoose.Types.ObjectId(_id)

    const originalPost = await db.collection('posts').findOne({ _id })

    if (!originalPost) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      await db.collection('posts').updateOne({ _id }, { $set: { title: data.title } })
    }

    if (typeof data.body === 'string') {
      await db.collection('posts').updateOne({ _id }, { $set: { body: data.body } })
    }

    if (typeof data.published === 'boolean') {
      await db.collection('posts').updateOne({ _id }, { $set: { published: data.published } })

      const post = await db.collection('posts').findOne({ _id })

      if (originalPost.published && !post.published) {
        io.getIO().emit('post', {
          action: 'delete',
          post: { ...originalPost._doc }
        })
        // pubsub.publish('post', {
        //   post: {
        //     mutation: 'DELETED',
        //     data: originalPost
        //   }
        // })
      } else if (!originalPost.published && post.published) {
        io.getIO().emit('post', {
          action: 'create',
          post: { ...post._doc }
        })
        // pubsub.publish('post', {
        //   post: {
        //     mutation: 'CREATED',
        //     data: post
        //   }
        // })
      } else if (post.published) {
        io.getIO().emit('post', {
          action: 'update',
          post: { ...post._doc }
        })
        // pubsub.publish('post', {
        //   post: {
        //     mutation: 'UPDATED',
        //     data: post
        //   }
        // })
      }
    }

    return await db.collection('posts').findOne({ _id })
  },
  async deletePost(parent, args, { db, pubsub }, info) {
    const _id = mongoose.Types.ObjectId(args._id)
    // const postIndex = db.posts.findIndex(post => post.id === args.id)
    // const post = await db.collection('posts').findOne({_id})

    // if (postIndex === -1) {
    //   throw new Error('Post not found')
    // }

    // const [post] = db.posts.splice(postIndex, 1)
    const post = await db.collection('posts').findOneAndDelete({ _id })

    // db.comments = db.comments.filter(comment => comment.post !== args.id)
    const comments = await db.collection('comments').deleteMany({ post: _id })
    console.log(comments)

    if (post.value.published) {
      io.getIO().emit('post', {
        action: 'create',
        post: { ...post.value }
      })
      // pubsub.publish('post', {
      //   post: {
      //     mutation: 'DELETED',
      //     data: post.value
      //   }
      // })
    }

    return post.value
  },
}