const { GraphQLObjectType, GraphQLInt } = require("graphql");

module.exports = new GraphQLObjectType({
  name: "totalVote",
  fields: () => ({
    up: { type: GraphQLInt },
    down: { type: GraphQLInt }
  })
});
