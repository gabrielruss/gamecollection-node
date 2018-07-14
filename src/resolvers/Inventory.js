function games(parent, args, context, info) {
  return context.db.query.games({ where: { id_in: parent.gameIds } }, info);
}

module.exports = {
  games
};
