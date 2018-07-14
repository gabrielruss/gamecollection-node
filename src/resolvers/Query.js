const info = () => `This is my game collection API`;

async function inventory(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { name_contains: args.filter },
          { gameConsole_contains: args.filter },
          { condition_contains: args.filter }
        ]
      }
    : {};

  const queriedGames = await context.db.query.games(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    `{ id }`
  );

  const countSelectionSet = `
    {
      aggregate {
        count
      }
    }
  `;

  const linksConnection = await context.db.query.gamesConnection(
    {},
    countSelectionSet
  );

  return {
    count: linksConnection.aggregate.count,
    linkIds: queriedGames.map(game => game.id)
  };
}

module.exports = {
  info,
  inventory
};
