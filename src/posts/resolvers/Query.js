exports.Query = {
  async posts(parent, args, { db }, info) {
    const posts = await db.collection('posts').find().toArray()

    if (!args.query) {
      return await db.collection('posts').find().toArray()
    }

    return posts.filter(post => {
      if (post.title.toLowerCase().includes(args.query.toLowerCase())) {
        return post
      }

      if (post.body.toLowerCase().includes(args.query.toLowerCase())) {
        return post
      }
    })


  },
  post() {
    return {
      _id: "some_id_12345678",
      title: "A new post",
      body: "This is the body of the post",
      published: false
    }
  }
}