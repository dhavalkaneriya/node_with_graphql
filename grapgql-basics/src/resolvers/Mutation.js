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

  createPost(
    parent,
    args,
    {
      db: { users, posts }
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

    return post;
  },

  deletePost(
    parent,
    args,
    {
      db: { posts, comments }
    },
    info
  ) {
    const postIndex = posts.findIndex(post => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const deletedPost = posts.splice(postIndex, 1);

    comments = comments.filter(comment => comment.post !== args.id);

    return deletedPost[0];
  },

  createComment(
    parent,
    args,
    {
      db: { users, posts, comments }
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

    return comment;
  },

  deleteComment(
    parent,
    args,
    {
      db: { comments }
    },
    info
  ) {
    const commentIndex = comments.findIndex(comment => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const deletedComment = comments.splice(commentIndex, 1);

    return deletedComment[0];
  }
};

export default Mutation;
