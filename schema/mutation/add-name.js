const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} = require("graphql");

const Name = require("./../types/names");
const contest = require("./../types/contest");
const pgDb = require("./../../database/pgdb");

const NameInput = new GraphQLInputObjectType({
  name: "NameInput",
  fields: () => ({
    apiKey: { type: new GraphQLNonNull(GraphQLString) },
    contestId: { type: new GraphQLNonNull(GraphQLInt) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }
  })
});

module.exports = {
  type: Name,
  args: {
    input: { type: new GraphQLNonNull(NameInput) }
  },
  resolve(obj, { input }, { pgPool }) {
    return pgDb(pgPool).addNewName(input);
  }
};
