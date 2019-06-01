const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString
} = require("graphql");

const totalVote = require("./votes");

module.exports = new GraphQLObjectType({
  name: "Name",
  fields: () => {
    const user = require("./user");
    return {
      id: { type: GraphQLID },
      label: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      createdAt: { type: new GraphQLNonNull(GraphQLString) },
      createdBy: {
        type: new GraphQLNonNull(user),
        resolve(obj, args, { loaders }) {
          return loaders.usersByIds.load(obj.createdBy);
        }
      },
      totalVotesCount: {
        type: totalVote,
        resolve(obj, args, { loaders }) {
          console.log(obj);
          return loaders.userTotalVotes.load(obj.id);
        }
      }
    };
  }
});
