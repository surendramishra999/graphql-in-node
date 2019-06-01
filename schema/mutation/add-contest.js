const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} = require("graphql");
const Contest = require("./../types/contest");
const pgDb = require("./../../database/pgdb");

const ContestInput = new GraphQLInputObjectType({
  name: "ContestInput",
  fields: () => ({
    apiKey: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }
  })
});
module.exports = {
  type: Contest,
  args: {
    input: { type: new GraphQLNonNull(ContestInput) }
  },
  resolve(obj, { input }, { pgPool }) {
    return pgDb(pgPool).addNewContest(input);
  }
};
