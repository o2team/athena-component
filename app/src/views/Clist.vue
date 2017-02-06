<template>
<div class="clist">
  <sidebar
    :blist="blist"
    :allWidgetCount="pageCount"
    :stateBusiness="stateBusiness"
    :changeStateBusiness="changeStateBusiness"></sidebar>

  <div class="clist_main">
    <ul class="clist_main_header">
      <li
        :class="{
          active: !stateClassify
        }"
        @click="changeStateClassify(null)">不限</li>
      <li
        v-for="item in classify"
        :class="{
          active: stateClassify === item.id
        }"
        @click="changeStateClassify(item.id)">{{item.attributes.name}}</li>
    </ul>

    <div class="clist_main_search"><input type="text" placeholder="输入组件名搜索" v-model="stateSearchName"></div>

    <ul class="wlist">
      <li
        v-for="(item, index) in wlist"
        :key="item.id"
        :data-id="item.id"
        class="wlist_item">
        <div class="wlist_item_wrap">
          <router-link
            :to="{name: 'detail', params: {id:item.id}}"
            class="wlist_item_show">
            <!-- <img v-lazy="'http://acp.aotu.io/warehouse/_build/' + item.id + '/capture.png'"> -->
            <img v-lazy="'/warehouse/_build/' + item.id + '/capture.png'">
          </router-link>
          <div class="wlist_item_info">
            <div class="wlist_item_name">{{item.attributes.name}}</div>
            <div class="wlist_item_meta">
              <div class="wlist_item_meta_id">{{item.id}}</div>
              <div class="wlist_item_meta_pulltimes" title="拉取次数">{{item.attributes.pullTimes}}</div>
            </div>
          </div>
        </div>
        <div class="wlist_item_del" v-show="isManageMode" @click="delWidget(item.id, index)"><div class="wlist_item_del_btn">删除</div></div>
      </li>
    </ul>

    <div v-show="!pageCanload" class="clist_nomore">没有更多的组件了……</div>
  </div>

  <div
    v-show="sessionUser"
    @click="toggleManage"
    class="clist_manage">切换管理模式</div>
</div>
</template>

<script>
import Sidebar from '../components/clist/Sidebar.vue'

export default {
  components: {
    Sidebar
  },
  data () {
    return {
      // Filter 条件
      stateBusiness: null,
      stateClassify: null,
      stateSearchName: '',

      // Pagination
      pageIndex: 0,
      pagePer: 20,
      pageCount: 0,
      pageCanload: true,

      // 管理模式
      isManageMode: false,

      // 渲染列表
      wlist: [],

      blist: [],
      classify: []
    }
  },
  computed: {
  },
  mounted () {
    this.getWidgets()
    this.getAllWidgetsCount()

    new AV.Query('Business').find().then((results) => {
      this.blist = results

      this.blist.forEach((e, i) => {
        let query = new AV.Query('Widget')
        query.notEqualTo('state', 0)
        query.equalTo('business', e)
        query.count().then((count) => {
          // 触发数组更新
          this.$set(this.blist, i, Object.assign({}, e, {count:count}))
        })
      })
    })
    new AV.Query('Classify').find().then((results) => {
      this.classify = results
    })

    window.addEventListener('scroll', this.pagination(), false)
  },
  methods: {
    resetPage () {
      this.pageIndex = 0
      this.pageCanload = true
    },
    changeStateBusiness (id) {
      if (id === this.stateBusiness) {
        return
      }
      this.resetPage()
      this.stateBusiness = id
      this.getWidgets()
    },
    changeStateClassify (id) {
      if (id === this.stateClassify) {
        return
      }
      this.resetPage()
      this.stateClassify = id
      this.getWidgets()
    },
    // 删除组件
    delWidget (itemId, index) {
      if (confirm('确定要删除该组件吗')) {
        let w = AV.Object.createWithoutData('Widget', itemId)
        w.set('state', 0)
        w.save().then((data) => {
          _POP_.toast('删除成功')
          this.wlist.splice(index, 1)
        }, function (error) {
          _POP_.toast('删除失败')
        })
      }
    },
    // 切换管理模式
    toggleManage () {
      this.isManageMode = !this.isManageMode
    },
    // 获取组件
    getWidgets () {
      if (!this.pageCanload) {
        return
      }
      let query = new AV.Query('Widget')
      query.descending('createdAt')
      query.notEqualTo('state', 0)
      if (this.stateBusiness) {
        let tmpBusiness = AV.Object.createWithoutData('Business', this.stateBusiness)
        query.equalTo('business', tmpBusiness)
      }
      if (this.stateClassify) {
        let tmpClassify = AV.Object.createWithoutData('Classify', this.stateClassify)
        query.equalTo('classify', tmpClassify)
      }
      if (this.stateSearchName) {
        query.contains('name', this.stateSearchName)
      }
      query.limit(this.pagePer)
      query.skip(this.pageIndex * this.pagePer)
      query.find().then((results) => {
        if (results.length === 0) {
          this.pageCanload = false
        }
        if (this.pageIndex > 0) {
          this.wlist = this.wlist.concat(results)
        } else {
          this.wlist = results
        }
      })
    },
    // 获取组件总数
    getAllWidgetsCount () {
      new AV.Query('Widget').notEqualTo('state', 0).count().then((count) => {
        this.pageCount = count
      })
    },
    addTag (item, newTagName) {
      if(!newTagName) {
        _POP_.toast('标签为空')
        return
      }
      // 存储TAG
      let w = new AV.Object.createWithoutData('Widget', item.id)
      w.addUnique('tags', [newTagName])
      w.save().then((w) => {
        item.attributes.tags.push(newTagName)
        item.newTagName = ''
        _POP_.toast('添加成功')
      }, (error) => {
        _POP_.toast('添加失败')
      })
    },
    removeTag (item, y, index) {
      let w = AV.Object.createWithoutData('Widget', item.id)
      w.remove('tags', [y])
      w.save().then((success) => {
        item.attributes.tags.splice(index, 1)
        _POP_.toast('删除成功')
      }, (error) => {
        _POP_.toast('删除失败')
      })
    },
    throttle (fn, delay) {
      let now, lastExec, timer, context, args

      let execute = function () {
        fn.apply(context, args)
        lastExec = now
      }

      return function () {
        context = this
        args = arguments

        now = Date.now()

        if (timer) {
          clearTimeout(timer)
          timer = null
        }

        if (lastExec) {
          let diff = delay - (now - lastExec)
          if (diff < 0) {
            execute()
          } else {
            timer = setTimeout(() => {
              execute()
            }, diff)
          }
        } else {
          execute()
        }
      }
    },
    checkToBottom (distance = 800) {
      // 滚动条在Y轴上的滚动距离
      let _getScrollTop = function () {
        let bodyScrollTop = document.body ? document.body.scrollTop : 0
        let docScrollTop = document.documentElement ? document.documentElement.scrollTop : 0
        return Math.max(bodyScrollTop, docScrollTop)
      }
      // 文档的总高度
      let _getScrollHeight = function () {
        let bodyScrollHeight = document.body ? document.body.scrollHeight : 0
        let docScrollHeight = document.documentElement ? document.documentElement.scrollHeight : 0
        return Math.max(bodyScrollHeight, docScrollHeight)
      }
      // 浏览器视口的高度
      let _getWindowHeight = function () {
        return document.compatMode === 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight
      }

      return _getScrollTop() + _getWindowHeight() + distance >= _getScrollHeight()
    },
    pagination () {
      return this.throttle(() => {
        if (this.checkToBottom(1200)) {
          this.pageIndex++
          this.getWidgets()
        }
      }, 500)
    }
  },
  watch: {
    state: {
      handler: function(value, oldValue) {
        this.cacheImg()
      },
      deep: true
    },
    stateSearchName (val) {
      this.resetPage()
      this.getWidgets()
    }
  }
}
</script>

<style lang="sass">
@import '../sass/_common';

.clist {
  @include flexbox;
  min-height: 800px;
}

.clist_main {
  @include flex; width: 0;
  background: #f4f4f4;
}
.clist_main_header {
  @include flexbox;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
  background: rgba(253, 253, 253, .9);
  li {
    margin-right: 10px;
    padding: 0 10px;
    border: 1px solid #6190E8;
    border-radius: 2px;
    background: rgba(97, 144, 232, .9);
    color: #fff;
    cursor: pointer;
    &.active {
      background: transparent;
      color: #333;
    }
  }
}


/* 组件搜索 */
.clist_main_search {
  padding: 10px 20px;
  input {
    box-sizing: border-box;
    padding: 10px; width: 100%;
    border: 1px solid #6190e8; background: #f8f8f8; text-align: center;
    &:focus {
      background: #fff;
    }
  }
}


.wlist {
  padding: 0 10px;
  overflow: hidden;
}
/* 组件项 */
.wlist_item {
  position: relative;
  width: 227px;
  float: left;
  margin: 0 10px 10px;
  vertical-align: top;
  &:hover {
    .wlist_item_wrap {
      border: 1px solid orange;
    }
    .wlist_item_info {
      -webkit-transform: translate(0, -30px); transform: translate(0, -30px);
    }
  }
}
.wlist_item_wrap {
  height: 257px;
  min-width: 114px;
  max-width: 300px;
  background: #fff;
  border: 1px solid transparent; border-bottom: 1px solid #ccc;
  overflow: hidden;
  -webkit-transition: .6s ease; transition: .6s ease;
}
.wlist_item_show {
  display: block;
  height: 225px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAV1gAAFdYB1mtZ/QAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAXdEVYdENyZWF0aW9uIFRpbWUAMjAxNi4yLjE5feXuqAAAAElJREFUOI3t0bEJwEAMQ1EpZIzbfzAt8q9KaZEikObUyjyMbQANAZREZUTX2LzMAT4A7vYiQLY7kGQsbWutVZG6wYM04P8jHkDaCZEYwmwI7+IAAAAASUVORK5CYII=);
  overflow: hidden;
  img {
    width: 100%;
  }
}
.wlist_item_info {
  height: 32px;
  background: #fff;
  -webkit-transition: .3s ease; transition: .3s ease;
}
.wlist_item_name {
  height: 32px; line-height: 32px;
  white-space: nowrap; word-wrap: normal; overflow: hidden; text-overflow: ellipsis;
  text-align: center;
}
.wlist_item_meta {
  padding: 0 10px;
  height: 30px;
  > div {
    float: left;
    width: 50%; height: 30px; line-height: 30px;
  }
}
.wlist_item_meta_pulltimes {
  -webkit-user-select: none;
  user-select: none;
  text-align: right;
}
.wlist_item_del {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  text-align: center;
  cursor: pointer;
  &:before {
    content: '';
    display: inline-block;
    width: 0; height: 100%;
    font-size: 0;
  }
  &:before, .wlist_item_del_btn {
    vertical-align: middle;
  }
  .wlist_item_del_btn {
    display: inline-block;
    padding: 3px 20px;
    border-radius: 2px;
    background: #df3e3e;
    color: #fff;
    &:hover {
      background: #db2828;
    }
  }
}
.clist_nomore {
  padding: 60px 0 50px;
  font-size: 16px;
  text-align: center;
}

.clist_manage {
  position: fixed;
  padding: 5px 10px;
  bottom: 20px; right: 20px;
  border-radius: 4px;
  background: #6190e8;
  color: #fff;
  cursor: pointer;
}
</style>
