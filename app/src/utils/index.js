/**
 * ==================================================
 * 通用弹层
 * ==================================================
 */
const _POP_ = {
  toast (text) {
    if (!text) {
      return
    }
    let rid = `toast_${Date.now()}`
    let div = document.createElement('div')
    div.innerHTML = `<div id="${rid}" style="z-index:4;position:fixed;top:0;left:0;display:block;width:100%;height:100%; text-align:center;font-size:0;">
                      <div style="display:inline-block;*display:inline;*zoom:1;vertical-align:middle;font-size:16px;">
                        <div style="padding:30px 40px;min-width: 200px;_width: 200px;background:rgba(0,0,0,0.8);border-radius:5px;">
                          <div style="font-size:18px;color:#fff;">${text}</div>
                        </div>
                      </div>
                      <span style="display:inline-block;*display:inline;*zoom:1;width:0;height:100%;vertical-align:middle;"></span>
                    </div>`
    document.body.appendChild(div.childNodes[0])

    let dom = document.getElementById(rid)
    let timer = setTimeout(() => {
      dom.parentNode.removeChild(dom)
    }, 1500)
    dom.addEventListener('click', () => {
      clearTimeout(timer)
      dom.parentNode.removeChild(dom)
    })
  }
}

/**
 * ==================================================
 * 通用Cookie操作函数
 * ==================================================
 */
const Cookie = {
  setCookie (name, value, days) {
    let date = new Date()
    date.setDate(date.getDate() + days)    //保存15天
    document.cookie = `${name}=${escape(value)};expires=${date.toGMTString()}`
  },
  getCookie (name) {
    let arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`))
    if (arr) {
      return unescape(arr[2])
    }
  },
  delCookie (name) {
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = this.getCookie(name)
    if (cval) {
      document.cookie= `${name}=${cval};expires=${exp.toGMTString()}`
    }
  }
}

export default {
  _POP_,
  Cookie
}
