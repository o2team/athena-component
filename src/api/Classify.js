import { Classify } from '../dao'

async function list (ctx) {
  await Classify.query().then((results) => {
    ctx.body = results
  }).catch((error) => {
    console.log('CLASSIFY-LIST', error)
  })
}

module.exports = {
	list
}
