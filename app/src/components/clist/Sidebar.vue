<template>
<aside class="clist_sidebar">
  <div class="clist_sidebar_header">
    <h2>业务导航</h2>
  </div>
  <div class="clist_sidebar_list">
    <h3></h3>
    <ul>
      <li
        :class="{
          active: !stateBusiness
        }"
        @click="changeStateBusiness(null)"
        class="clist_sidebar_it">
        <span class="clist_sidebar_it_name">全部</span>
        <span class="clist_sidebar_it_count">{{allWidgetCount}}</span>
      </li>
      <li
        v-for="item in blist"
        :class="{
          active: stateBusiness === item.id
        }"
        @click="changeStateBusiness(item.id)"
        class="clist_sidebar_it">
        <span class="clist_sidebar_it_name">{{ item.attributes.name }}</span>
        <span class="clist_sidebar_it_count">{{ item.count || 0 }}</span>
      </li>
    </ul>
  </div>
</aside>
</template>

<script>
export default {
  props: {
    blist: {
      type: Array
    },
    allWidgetCount: {
      type: Number
    },
    stateBusiness: {
      type: String
    },
    changeStateBusiness: {
      type: Function,
      require: true
    }
  }
}
</script>

<style lang="sass">
.clist_sidebar {
  width: 232px;
  background-color: #fff;
  border-right: 1px solid #e8e8e8;
}
.clist_sidebar_header {
  padding: 10px 25px;
  border-bottom: 1px solid #e8e8e8;
  h2 {
    height: 40px; line-height: 40px;
    font-size: 20px;
  }
}
.clist_sidebar_it {
  padding: 10px 25px;
  height: 28px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  &.active {
    background-color: #fff5ee;
    border-color: #f8d4bc;
    .clist_sidebar_it_name {
      color: #f60;
    }
    .clist_sidebar_it_count {
      background-color: #ffb17e;
      border-color: #ffb17e;
      color: #fff;
    }
  }
}
.clist_sidebar_it_name {
  float: left;
  line-height: 28px;
  font-size: 14px;
  color: #727272;
}
.clist_sidebar_it_count {
  float: right;
  margin-top: 3px;
  padding: 0 8px;
  height: 20px; line-height: 20px;
  font-size: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  cursor: default;
}
</style>
