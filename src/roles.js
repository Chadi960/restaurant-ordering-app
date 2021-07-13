const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("user")
    .readOwn("profile")
    .updateOwn("profile")

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

  return ac;
})();
