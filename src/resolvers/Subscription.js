function newGameSubscribe(parent, args, context, info) {
  return context.db.subscription.game(
    { where: { mutation_in: ["CREATED"] } },
    info
  );
}

const newGame = {
  subscribe: newGameSubscribe
};

function newVoteSubscribe(parent, args, context, info) {
  return context.db.subscription.vote(
    { where: { mutation_in: ["CREATED"] } },
    info
  );
}

const newVote = {
  subscribe: newVoteSubscribe
};

module.exports = {
  newGame,
  newVote
};
