let users = [
  {
    id: "123",
    name: "A",
    email: "a@gmail.com",
    age: 27
  },
  {
    id: "456",
    name: "B",
    email: "b@gmail.com"
  },
  {
    id: "789",
    name: "C",
    email: "c@gmail.com"
  }
];

let posts = [
  {
    id: "123",
    title: "title 1",
    body: "body 1",
    isPublish: true,
    author: "123"
  },
  {
    id: "456",
    title: "title 2",
    body: "body 2",
    isPublish: true,
    author: "456"
  },
  {
    id: "789",
    title: "title 3",
    body: "body 3",
    isPublish: false,
    author: "789"
  }
];

let comments = [
  {
    id: "1",
    text: "comment 1",
    author: "123",
    post: "123"
  },
  {
    id: "2",
    text: "comment 2",
    author: "456",
    post: "456"
  },
  {
    id: "3",
    text: "comment 3",
    author: "789",
    post: "789"
  },
  {
    id: "4",
    text: "comment 4",
    author: "123",
    post: "123"
  }
];

const db = {
  users,
  posts,
  comments
};

export { db as default };
