const info = () => `This is my game collection API`;

function inventory(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { name_contains: args.filter },
          { gameConsole_contains: args.filter },
          { condition_contains: args.filter }
        ]
      }
    : {};
  return context.db.query.games({ where }, info);
}

module.exports = {
  info,
  inventory
};
