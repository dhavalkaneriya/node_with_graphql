const Query = {
  users(
    parent,
    args,
    {
      db: { users }
    },
    info
  ) {
    if (args.query) {
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    }

    return users;
  },
  posts(
    parent,
    args,
    {
      db: { posts }
    },
    info
  ) {
    return posts;
  },
  comments(
    parent,
    args,
    {
      db: { comments }
    },
    info
  ) {
    return comments;
  },
  me() {
    return {
      id: "123-456-789",
      name: "DK",
      email: "dhaval@gmail.com",
      age: 27
    };
  },
  post() {
    return {
      id: "abc-def-ghi",
      title: "graphql post",
      body: "lorun ipsum lorun ipsum lorun ipsum lorun ipsum lorun ipsum",
      isPublish: false
    };
  }
};

export default Query;
