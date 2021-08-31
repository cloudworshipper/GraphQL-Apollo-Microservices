const { and, or, rule, shield } = require('graphql-shield')

function getPermissions(user) {
  if (user && user["https://awesomeapi.com/graphql"]) {
    return user["https://awesomeapi.com/graphql"].permissions
  }

  return []
}

const isAuthenticated = rule()((parent, args, { user }, info) => {
  console.log(user)
  return user !== null
})

const canReadAnyAccount = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user)
  return userPermissions.includes("read:any_account")
})

const canReadOwnAccount = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user)
  return userPermissions.includes("read:own_account")
})

const isReadingOwnAccount = rule()((parent, { _id }, { user }, info) => {
  return user && user.sub === _id
})

const permissions = shield({
  Query: {
    comments: canReadAnyAccount,
  }
})

module.exports = { permissions }