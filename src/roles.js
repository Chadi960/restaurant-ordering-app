const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("user")
    .readOwn("profile")
    .updateOwn("profile")
    .readAny("item")
    .readOwn("order")
    .updateOwn("order")

  ac.grant("admin")
    .extend("user")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile")
    .readAny("branch")
    .updateAny("branch")
    .deleteAny("branch")
    .readAny("category")
    .updateAny("category")
    .deleteAny("category")
    .readAny("item")
    .updateAny("item")
    .deleteAny("item")
    .readAny("order")
    .updateAny("order")
    .deleteAny("order")

  return ac;
})();
