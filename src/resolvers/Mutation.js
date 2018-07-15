const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.db.mutation.createUser(
    {
      data: { ...args, password }
    },
    `{ id }`
  );

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  const user = await context.db.query.user(
    { where: { email: args.email } },
    `{ id password }`
  );
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

function createGame(parent, args, context, info) {
  const userId = getUserId(context);
  return context.db.mutation.createGame(
    {
      data: {
        name: args.name,
        gameConsole: args.gameConsole,
        condition: args.condition,
        createdBy: { connect: { id: userId } }
      }
    },
    info
  );
}

function updateGame(parent, args, context, info) {
  const userId = getUserId(context);
  return context.db.mutation.updateGame(
    {
      where: { id: args.gameId },
      data: {
        name: args.name,
        gameConsole: args.gameConsole,
        condition: args.condition,
        createdBy: { connect: { id: userId } }
      }
    },
    info
  );
}

async function deleteGame(parent, args, context, info) {
  return context.db.mutation.deleteGame(
    {
      where: { id: args.gameId }
    },
    info
  );
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context);

  const gameExists = await context.db.exists.Vote({
    user: { id: userId },
    game: { id: args.gameId }
  });
  if (gameExists) {
    throw new Error(`Already voted for game: ${args.gameId}`);
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        game: { connect: { id: args.gameId } }
      }
    },
    info
  );
}

module.exports = {
  signup,
  login,
  createGame,
  updateGame,
  deleteGame,
  vote
};
