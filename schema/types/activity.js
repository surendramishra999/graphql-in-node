const { GraphQLUnionType } = require("graphql");

const ContestType = require("./contest");
const NameType = require("./names");

module.exports = new GraphQLUnionType({
  name: "activity",
  types: [ContestType, NameType],
  resolveType(value) {
    return value.activityType === "contest" ? ContestType : NameType;
  }
});
