import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(
    parent,
    args,
    {
      db: { users }
    },
    info
  ) {
    const emailTaken = users.some(user => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("Email is already taken.");
    }

    const user = {
      id: uuidv4(),
      ...args.data
    };

    users.push(user);

    return user;
  },

  deleteUser(
    parent,
    args,
    {
      db: { users, posts, comments }
    },
    info
  ) {
    const userIndex = users.findIndex(user => user.id === args.id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const deletedUser = users.splice(userIndex, 1);

    posts = posts.filter(post => {
      const match = post.author === args.id;

      if (match) {
        comments = comments.filter(comment => comment.post !== post.id);
      }

      return !match;
    });

    comments = comments.filter(comment => comment.author !== args.id);

    return deletedUser[0];
  },

  updateUser(
    parent,
    args,
    {
      db: { users }
    },
    info
  ) {
    const { id, data } = args;

    const user = users.find(user => user.id === args.id);

    if (!user) {
      throw new Error("User not found.");
    }

    if (typeof data.email === "string") {
      const emailTaken = users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error("email taken");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },

  createPost(
    parent,
    args,
    {
      db: { users, posts },
      pubsub
    },
    info
  ) {
    const userExist = users.some(user => user.id === args.data.author);

    if (!userExist) {
      throw new Error("User is not Exist");
    }

    const post = {
      id: uuidv4(),
      ...args.data
    };

    posts.push(post);

    if (args.data.isPublish) {
      pubsub.publish("post", {
        post: { mutation: "CREATED", data: post }
      });
    }

    return post;
  },

  deletePost(
    parent,
    args,
    {
      db: { posts, comments },
      pubsub
    },
    info
  ) {
    const postIndex = posts.findIndex(post => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const [post] = posts.splice(postIndex, 1);

    comments = comments.filter(comment => comment.post !== args.id);

    if (post.isPublish) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post
        }
      });
    }

    return post;
  },

  updatePost(
    parent,
    args,
    {
      db: { posts },
      pubsub
    },
    info
  ) {
    const { id, data } = args;
    const post = posts.find(post => post.id === id);

    const originPost = { ...post };

    if (!post) {
      throw new Error("User not found.");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.isPublish === "boolean") {
      post.isPublish = data.isPublish;

      if (originPost.isPublish && !post.isPublish) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originPost
          }
        });
      } else if (!originPost.isPublish && post.isPublish) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if (post.isPublish) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }

    return post;
  },

  updateComment(
    parent,
    args,
    {
      db: { comments },
      pubsub
    },
    info
  ) {
    const { id, data } = args;
    const comment = comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Commnet not found.");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });

    return comment;
  },

  createComment(
    parent,
    args,
    {
      db: { users, posts, comments },
      pubsub
    },
    info
  ) {
    const userExist = users.some(user => user.id === args.data.author);

    if (!userExist) {
      throw new Error("User is not Exist");
    }

    const postExist = posts.some(
      post => post.id === args.data.post && post.isPublish
    );

    if (!postExist) {
      throw new Error("Post is not Exist");
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });
    return comment;
  },

  deleteComment(
    parent,
    args,
    {
      db: { comments },
      pubsub
    },
    info
  ) {
    const commentIndex = comments.findIndex(comment => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const [deletedComment] = comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });

    return deletedComment;
  }
};

export default Mutation;
