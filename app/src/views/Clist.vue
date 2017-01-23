<template>
<div class="clist">
  <sidebar
    :blist="blist"
    :allWidgetCount="allWidgetCount"
    :stateBusiness="state.business"
    :changeStateBusiness="changeStateBusiness"></sidebar>

  <div class="clist_main">
    <ul class="clist_main_header">
      <li
        :class="{
          active: !state.classify
        }"
        @click="state.classify = null">不限</li>
      <li
        v-for="item in classify"
        :class="{
          active: state.classify === item.id
        }"
        @click="state.classify = item.id">{{item.attributes.name}}</li>
    </ul>

    <div class="clist_main_search"><input type="text" placeholder="输入组件名搜索" v-model="state.searchName"></div>

    <ul class="wlist">
      <li v-for="(item, index) in filterWlist" class="wlist_item">
        <div class="wlist_item_wrap">
          <router-link
            :to="{name: 'detail', params: {id:item.id}}"
            class="wlist_item_show">
            <div :data-cimg="item.id"></div>
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
      state: {
        business: null,
        classify: null,
        searchName: ''
      },

      // 管理模式
      isManageMode: false,

      // 渲染列表
      wlist: [],

      blist: [], allWidgetCount: 0,
      classify: [],

      search: {
        isSearching: false,
        prewlist: null
      }
    }
  },
  computed: {
    filterWlist () {
      return this.wlist.filter((item) => {
        if (this.state.searchName && item.attributes.name.indexOf(this.state.searchName) < 0) {
          return false
        }
        if (this.state.classify && item.attributes.classify !== this.state.classify) {
          return false
        }
        if (this.state.business && item.attributes.business !== this.state.business) {
          return false
        }
        return true
      })
    }
  },
  mounted () {
    var that = this

    this.getWidgets()
    this.getAllWidgetsCount()

    new AV.Query('Business').find().then(function(results) {
      that.blist = results

      // 计数，有点蛋疼，里层异步赋值不刷新视图？
      that.blist.forEach(function(e, i) {
        var query = new AV.Query('Widget')
        query.notEqualTo('state', 0)
        query.equalTo('business', e)
        query.count().then(function (count) {
          that.blist.$set(i, Object.assign({}, e, {count:count}))
        })
      })
    })
    new AV.Query('Classify').find().then(function(results) {
      that.classify = results
    })
  },
  methods: {
    changeStateBusiness (id) {
      this.state.business = id
    },
    // 删除组件
    delWidget: function (itemId, index) {
      var that = this;
      if(confirm('确定要删除该组件吗')) {
        var w = AV.Object.createWithoutData('Widget', itemId);
        w.set('state', 0);
        w.save().then(function (data) {
          _POP_.toast('删除成功');
          that.wlist.splice(index, 1);
        }, function (error) {
          _POP_.toast('删除失败');
        });
      }
    },
    // 切换管理模式
    toggleManage: function () {
      this.isManageMode = !this.isManageMode;
    },
    // 获取组件
    getWidgets: function() {
      var that = this;

      var query = new AV.Query('Widget');
      query.descending('createdAt');
      // query.descending('pullTimes');
      query.notEqualTo('state', 0);
      query.find().then(function (results) {
        // console.log(results[0].attributes)
          that.wlist = results;
          that.$nextTick(function () {
          that.cacheImg();
        });
      });
    },
    // 获取组件总数
    getAllWidgetsCount: function() {
      var that = this;
      new AV.Query('Widget').notEqualTo('state', 0).count().then(function(count) {
        that.allWidgetCount = count;
      });
    },
    addTag: function(item, newTagName) {
      if(!newTagName) {
        _POP_.toast('标签为空');
        return;
      }
      var that = this;
      // 存储TAG
      var w = new AV.Object.createWithoutData('Widget', item.id);
      w.addUnique('tags', [newTagName]);
      w.save().then(function (w) {
        item.attributes.tags.push(newTagName);
        item.newTagName = '';
        _POP_.toast('添加成功');
      }, function (error) {
        _POP_.toast('添加失败');
      });
    },
    removeTag: function(item, y, index) {
      var that = this;
      var w = AV.Object.createWithoutData('Widget', item.id);
      w.remove('tags', [y]);
      w.save().then(function (success) {
        item.attributes.tags.splice(index, 1);
          _POP_.toast('删除成功');
      }, function (error) {
          _POP_.toast('删除失败');
      });
    },
    cacheImg: function() {
      $('[data-cimg]').each(function(index, domEl) {
        var wid = $(this).data('cimg');
        var cimg = document.createElement('img');
        var canvas = document.createElement('canvas');
        cimg.onerror = function() {
          cimg.onload = null;
          this.src = 'http://jdc.jd.com/img/200x100?color=5CC26F&textColor=fff&text=No Capture';
        }
        if(localStorage && canvas.getContext) {
          var lsdata = localStorage.getItem(wid);
          var imgcontent = canvas.getContext('2d');
          lsdata = lsdata ? JSON.parse(lsdata) : '';
          if(lsdata && lsdata.expires > Date.now()) {
            cimg.src = lsdata.data;
          } else {
            cimg.onload = function() {
              console.log(wid)
              canvas.width = this.width;
              canvas.height = this.height;
              imgcontent.drawImage(this, 0, 0, this.width, this.height);
              var imgAsDataUrl = canvas.toDataURL('image/png');
              localStorage.setItem(wid, JSON.stringify({
                expires: Date.now() + 864000000, // 10天
                data: imgAsDataUrl
              }));
            }
            cimg.src = 'warehouse/_build/' + wid + '/capture.png';
          }
        } else {
          cimg.src = 'warehouse/_build/' + wid + '/capture.png';
        }
        domEl.appendChild(cimg);
      });
    }
  },
  watch: {
    'state': {
      handler: function(value, oldValue) {
        this.cacheImg();
      },
      deep: true
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
  &:hover {
    .wlist_item_wrap {
      border: 1px solid orange;
    }
    .wlist_item_info {
      -webkit-transform: translate(0, -30px); transform: translate(0, -30px);
    }
  }
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
