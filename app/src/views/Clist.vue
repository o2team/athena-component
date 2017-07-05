<template>
<div class="clist">
  <sidebar
    :businessList="businessList"
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
        v-for="item in classifyList"
        :class="{
          active: stateClassify === item.objectId
        }"
        @click="changeStateClassify(item.objectId)">{{item.name}}</li>
    </ul>

    <div class="clist_main_search"><input type="text" placeholder="输入组件名搜索" v-model="stateSearchName"></div>

    <ul class="wlist">
      <item
        v-for="(item, index) in widgetList"
        :key="item.objectId"
        :item="item"
        :index="index"
        :isManageMode="isManageMode"
        :delWidget="delWidget"></item>
    </ul>

    <div v-show="widgetListEnd" class="clist_nomore">没有更多的组件了……</div>
  </div>

  <div
    v-show="sessionUser"
    @click="toggleManage"
    class="clist_manage">切换管理模式</div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Utils from '@/utils'
import Sidebar from '@/components/clist/Sidebar.vue'
import Item from '@/components/clist/Item.vue'

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
      pageCount: 0,

      // 管理模式
      isManageMode: false
    }
  },
  computed: {
    ...mapGetters({
      widgetList: 'widgetList',
      widgetListEnd: 'widgetListEnd',
      widgetDelStatus: 'widgetDelStatus',
      businessList: 'businessList',
      classifyList: 'classifyList'
    })
  },
  methods: {
    ...mapActions([
      'getWidgetList',
      'delWidget',
      'getBusinessList',
      'getClassifyList'
    ]),
    resetPage () {
      this.pageIndex = 0
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
    // 切换管理模式
    toggleManage () {
      this.isManageMode = !this.isManageMode
    },
    // 获取组件
    getWidgets () {
      if (this.pageIndex > 0 && this.widgetListEnd) {
        return
      }
      this.getWidgetList({
        keyword: this.stateSearchName,
        business: this.stateBusiness,
        classify: this.stateClassify,
        page: this.pageIndex,
        added: this.pageIndex > 0
      })
    },
    // 获取组件总数
    // getAllWidgetsCount () {
    //   new AV.Query('Widget').notEqualTo('state', 0).count().then((count) => {
    //     this.pageCount = count
    //   })
    // },
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
  mounted () {
    this.getWidgetList({})
    this.getBusinessList()
    this.getClassifyList()

    let queryBusiness = this.$route.query.business
    let queryClassify = this.$route.query.classify
    this.stateBusiness = queryBusiness || null
    this.stateClassify = queryClassify || null

    // this.getAllWidgetsCount()

    window.addEventListener('scroll', this.pagination(), false)
  },
  watch: {
    widgetDelStatus (val) {
      if (val === 0) {
        Utils._POP_.toast('删除成功')
      } else if (val === 1) {
        Utils._POP_.toast('删除失败')
      }
    },
    state: {
      handler: function (value, oldValue) {
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
