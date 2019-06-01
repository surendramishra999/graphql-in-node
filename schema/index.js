const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require("graphql");

const user = require("./types/user");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: () => ({
    user: {
      type: user,
      description: "Test hello world example",
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (obj, args, { loaders }) => {
        return loaders.usersByApiKeys.load(args.key);
      }
    }
  })
});
const AddContestMutation = require("./mutation/add-contest");
const AddNameMutation = require("./mutation/add-name");
const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: () => ({
    AddContest: AddContestMutation,
    AddName: AddNameMutation
  })
});

const ncSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});

module.exports = ncSchema;
