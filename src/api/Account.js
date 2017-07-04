import { Account } from '../dao'

async function list (ctx) {
  await Account.query().then((results) => {
    ctx.body = results
  }).catch((error) => {
    console.error(error)
  })
}

// async function check (ctx) {
//   const query = ctx.request.query
//   const name = query.name
//   await Account.first(name).then((result) => {
//     ctx.body = result
//   })
// }

/**
 * 添加白名单用户
 * @param name {String} 用户名
 */
async function add (ctx) {
  const query = ctx.request.query
  const name = query.name
  if (!name) {
    ctx.status = 403
    return
  }
  await Account.add({name}).then(() => {
    ctx.status = 200
  }).catch((error) => {
    console.log(error)
    ctx.status = 403
  })
}

async function del (ctx) {
  const id = ctx.params.id
  Account.destory(id).then(() => {
    ctx.status = 200
  }).catch((error) => {
    ctx.status = 403
  })
}

module.exports = {
  list,
  add,
  del
}
