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
      <item
        v-for="(item, index) in wlist"
        :key="item.id"
        :item="item"
        :index="index"
        :isManageMode="isManageMode"
        :delWidget="delWidget"
        ></item>
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
import Item from '../components/clist/Item.vue'

export default {
  components: {
    Sidebar,
    Item
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
    let queryBusiness = this.$route.query.business
    let queryClassify = this.$route.query.classify
    this.stateBusiness = queryBusiness || null
    this.stateClassify = queryClassify || null

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
      let tmpQuery = {}
      if (this.stateBusiness) {
        tmpQuery.business = this.stateBusiness
      }
      if (this.stateClassify) {
        tmpQuery.classify = this.stateClassify
      }
      this.$router.replace({name: 'list', query: tmpQuery})
    },
    changeStateBusiness (id) {
      if (id === this.stateBusiness) {
        return
      }
      this.stateBusiness = id
      this.resetPage()
      this.getWidgets()
    },
    changeStateClassify (id) {
      if (id === this.stateClassify) {
        return
      }
      this.stateClassify = id
      this.resetPage()
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
