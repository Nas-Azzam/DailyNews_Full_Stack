const AccessControl = require('accesscontrol');

let grantsObject = {
 admin: {
  profile: {
   'create': ['*'],
   'read': ['*'],
   'update': ['*'],
   'delete': ['*'],
 
  }
 },
 user: {
  profile: {
 ''
}
 }
}

const roles = new AccessControl(grantsObject) );

module.exports = roles;
