const info = () => `This is my game collection API`;

function inventory(parent, args, context, info) {
  return context.db.query.games({}, info);
}

module.exports = {
  info,
  inventory
};
