const humps = require("humps");
const _ = require("lodash");

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",

  orderedFor: function(rows, collection, field, isSingle = true) {
    // return the rows ordered for collection
    const data = humps.camelizeKeys(rows);
    const inGroupsOfFiled = _.groupBy(data, field);
    return collection.map(element => {
      const elementArray = inGroupsOfFiled[element];
      if (elementArray) {
        return isSingle ? elementArray[0] : elementArray;
      } else {
        return isSingle ? {} : [];
      }
    });
  },
  slug: function(str) {
    return str.toLowerCase().replace(/[\s\W-]+/, "-");
  }
};
