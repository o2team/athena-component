import { Business } from '../dao'

async function list (ctx) {
  await Business.list().then((results) => {
    ctx.body = results
  }).catch((error) => {
    console.log('BUSINESS-LIST', error)
  })
}

module.exports = {
	list
}
