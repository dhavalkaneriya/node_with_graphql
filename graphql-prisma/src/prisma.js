import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

// export const users = prisma.query
//   .users(null, "{ id name email posts { id title body } }")
//   .then(data => {
//     console.log(JSON.stringify(data));
//   });

// export const posts = prisma.query
//   .posts(null, "{ id name email posts { id title body } }")
//   .then(data => {
//     console.log(JSON.stringify(data));
//   });

// export const comments = prisma.query
//   .comments(null, "{id text author {id name}}")
//   .then(data => {
//     console.log(JSON.stringify(data));
//   });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "Prisma ORM with nodeJs part 3",
//         body:
//           "in this tutorial we'll gonna look into how to fire prisma query from nodjs part 3",
//         published: true,
//         author: {
//           connect: {
//             id: "cjvlyaood005z0872ztly5fup"
//           }
//         }
//       }
//     },
//     "{id title body published author { id name email }}"
//   )
//   .then(data => {
//     console.log(JSON.stringify(data));
//     return prisma.query.users(
//       null,
//       "{ id name email posts { id title body } }"
//     );
//   })
//   .then(data => {
//     console.log(JSON.stringify(data));
//   });

prisma.mutation
  .updatePost(
    {
      data: {
        title: "Prisma ORM with nodeJs part 2 continue",
        body:
          "in this tutorial we'll gonna look into how to fire prisma query from nodjs part 2 continue"
      },
      where: {
        id: "cjvm3jodv02kf08729r6edj6s"
      }
    },
    "{ id }"
  )
  .then(data => {
    console.log(JSON.stringify(data));
    return prisma.query.posts(null, "{ id title body published}");
  })
  .then(data => {
    console.log(JSON.stringify(data));
  });
