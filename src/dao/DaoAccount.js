import Parse from './init'

const Account = Parse.Object.extend('Account')

function query () {
  const query = new Parse.Query(Account)
  query.descending('createdAt')
  return query.find().then((results) => {
    return results
  })
}

function first (name) {
  const query = new Parse.Query(Account)
  query.equalTo('name', name)
  return query.first().then((result) => {
    return result
  })
}

function add ({name}) {
  const account = new Account()
  account.set('name', name)
  return account.save()
}

function destroy (id) {
  const account = Account.createWithoutData(id)
  return account.destroy()
}

export default {
  query,
  first,
  add,
  destroy
}
