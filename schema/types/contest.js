const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} = require("graphql");

const ContestStatus = require("./contest-status");
const Name = require("./names");
module.exports = new GraphQLObjectType({
  name: "Contest",
  fields: () => ({
    id: { type: GraphQLID },
    code: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    status: { type: new GraphQLNonNull(ContestStatus) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    name: {
      type: new GraphQLList(Name),
      resolve(obj, args, { loaders }) {
        return loaders.namesListByContestIds.load(obj.id);
      }
    }
  })
});
