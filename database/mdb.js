const { orderedFor } = require("./../lib/util");
module.exports = mPool => {
  return {
    getUsersbyUserId(userIds) {
      return mPool
        .collection("users")
        .find({ userId: { $in: userIds } })
        .toArray()
        .then(users => {
          return orderedFor(users, userIds, "userId");
        });
    }
  };
};
