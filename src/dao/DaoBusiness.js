import Parse from './init'

const Business = Parse.Object.extend('Business')

function list () {
  const query = new Parse.Query(Business)
  return query.find()
}

function getById (id) {
  const query = new Parse.Query(Business)
  return query.get(id).then((result) => {
    return result
  })
}

export default {
  list,
  getById
}
