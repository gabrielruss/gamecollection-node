const { GraphQLServer } = require("graphql-yoga");

let games = [
  {
    id: "game-0",
    name: "Zelda",
    gameConsole: "NES"
  }
];

let idCount = games.length;

const resolvers = {
  Query: {
    info: () => `This is my game collection API`,
    inventory: () => games
  },

  Mutation: {
    createGame: (parent, args) => {
      const game = {
        id: `game-${idCount++}`,
        name: args.name,
        gameConsole: args.gameConsole
      };
      games.push(game);
      return game;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
