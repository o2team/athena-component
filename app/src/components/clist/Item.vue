<template>
<li
  :data-id="item.objectId"
  class="clist_item">
  <div class="clist_item_wrap">
    <router-link
      :to="{name: 'detail', params: {id:item.objectId}}"
      class="clist_item_show">
      <img v-lazy="'/warehouse/' + item.objectId + '/capture.png'">
    </router-link>
    <div class="clist_item_info">
      <div class="clist_item_name">{{item.name}}</div>
      <div class="clist_item_meta">
        <div class="clist_item_meta_id">{{item.objectId}}</div>
        <div class="clist_item_meta_pulltimes" title="拉取次数">{{item.pullTimes}}</div>
      </div>
    </div>
  </div>
  <div class="clist_item_del" v-show="isManageMode" @click="confirmDel(item.objectId, index)"><div class="clist_item_del_btn">删除</div></div>
</li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    },
    isManageMode: {
      type: Boolean
    },
    delWidget: {
      type: Function,
      required: true
    }
  },
  methods: {
    confirmDel (id, index) {
      if (window.confirm('确定要删除该组件吗')) {
        this.delWidget({id, index})
      }
    }
  }
}
</script>

<style lang="sass">
.clist_item {
  position: relative;
  width: 227px;
  float: left;
  margin: 0 10px 10px;
  vertical-align: top;
  &:hover {
    .clist_item_wrap {
      border: 1px solid orange;
    }
    .clist_item_info {
      -webkit-transform: translate(0, -30px); transform: translate(0, -30px);
    }
  }
}
.clist_item_wrap {
  height: 257px;
  min-width: 114px;
  max-width: 300px;
  background: #fff;
  border: 1px solid transparent; border-bottom: 1px solid #ccc;
  overflow: hidden;
  -webkit-transition: .6s ease; transition: .6s ease;
}
.clist_item_show {
  display: block;
  height: 225px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAV1gAAFdYB1mtZ/QAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAXdEVYdENyZWF0aW9uIFRpbWUAMjAxNi4yLjE5feXuqAAAAElJREFUOI3t0bEJwEAMQ1EpZIzbfzAt8q9KaZEikObUyjyMbQANAZREZUTX2LzMAT4A7vYiQLY7kGQsbWutVZG6wYM04P8jHkDaCZEYwmwI7+IAAAAASUVORK5CYII=);
  overflow: hidden;
  img {
    width: 100%;
  }
}
.clist_item_info {
  height: 32px;
  background: #fff;
  -webkit-transition: .3s ease; transition: .3s ease;
}
.clist_item_name {
  height: 32px; line-height: 32px;
  white-space: nowrap; word-wrap: normal; overflow: hidden; text-overflow: ellipsis;
  text-align: center;
}
.clist_item_meta {
  padding: 0 10px;
  height: 30px;
  > div {
    float: left;
    width: 50%; height: 30px; line-height: 30px;
  }
}
.clist_item_meta_pulltimes {
  -webkit-user-select: none;
  user-select: none;
  text-align: right;
}
.clist_item_del {
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
  &:before {
    vertical-align: middle;
  }
}
.clist_item_del_btn {
  display: inline-block;
  padding: 3px 20px;
  border-radius: 2px;
  background: #df3e3e;
  color: #fff;
  vertical-align: middle;
  &:hover {
    background: #db2828;
  }
}
</style>
