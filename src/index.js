const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const resolvers = {
  Query: {
    info: () => `This is my game collection API`,
    inventory: (root, args, context, info) => {
      return context.db.query.games({}, info);
    }
  },

  Mutation: {
    createGame: (root, args, context, info) => {
      return context.db.mutation.createGame(
        {
          data: {
            name: args.name,
            gameConsole: args.gameConsole
          }
        },
        info
      );
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint:
        "https://us1.prisma.sh/gabriel-russ-c7e03e/gamecollection-node/dev",
      secret: "gabriel123",
      debug: true
    })
  })
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
