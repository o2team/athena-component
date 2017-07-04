import Parse from './init'

const Classify = Parse.Object.extend('Classify')

function query () {
  const query = new Parse.Query(Classify)
  return new Promise((resolve, reject) => {
    query.find({
      success (results) {
        resolve(results)
      },
      error (error) {
        reject(error)
      }
    })
  })
}

function getById (id) {
  const query = new Parse.Query(Classify)
  return query.get(id).then((result) => {
    return result
  })
}

export default {
  query,
  getById
}
