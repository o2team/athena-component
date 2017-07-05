<template>
<header class="mod_header">
	<div class="mod_header_logo">
		<h1>
			<router-link :to="{name: 'list'}">
				<img src="../images/logo-square-120.png">
				<span>运营组件库</span>
			</router-link>
		</h1>
	</div>
	<nav class="mod_header_nav">
		<div class="mod_header_nav_wrap">
			<router-link
        :to="{path: '/list', name:'list'}"
        active-class="active"
        class="mod_header_nav_item">
        <div class="mod_header_nav_item">组件</div>
      </router-link>
			<router-link
        :to="{path: '/white', name:'white'}"
        active-class="active"
        v-show="sessionUser"
        class="mod_header_nav_item">
        <div class="mod_header_nav_item">白名单</div>
      </router-link>
		</div>
	</nav>
	<div class="mod_header_userpanel">
		<div class="mod_header_userpanel_usermenu">
			<a class="mod_header_userpanel_usermenu_login" href="javascript:;" @click="showSignInPop" v-show="!sessionUser">登录</a>
			<div v-show="sessionUser">
				<span>欢迎您，{{sessionUser && sessionUser.username}}</span>
				<a @click="logout" href="javascript:;">退出</a>
			</div>
		</div>
	</div>

	<div class="loginpop" v-show="isShowLoginPop">
		<h2 class="loginpop_tit">登录</h2>
		<input class="loginpop_input" type="text" placeholder="用户名" v-model="loginUsername">
		<input class="loginpop_input" type="password" placeholder="密码" v-model="loginPassword">
		<div
      @click="login(loginUsername, loginPassword)"
      class="loginpop_btn">登录</div>
		<div
      @click="hideSignInPop"
      class="loginpop_close"></div>
	</div>

</header>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Utils from '@/utils'

export default {
  data () {
    return {
      addAccountName: '',
      isShowLoginPop: false,
      loginUsername: '',
      loginPassword: ''
    }
  },
  computed: mapGetters({
    sessionSignInState: 'sessionSignInState'
  }),
	methods: {
    showSignInPop () {
      this.isShowLoginPop = true
    },
    hideSignInPop () {
      this.isShowLoginPop = false
    },
		login (username, password) {
			if(!username) {
        Utils._POP_.toast('用户名为空')
        return
      }
			if(!password) {
        Utils._POP_.toast('密码为空')
        return
      }
      this.signIn({username, password})
		},
		logout () {
			this.signOut()
			Utils._POP_.toast('用户登出')
		},
    ...mapActions([
      'signIn',
      'signOut'
    ])
	},
  watch: {
    sessionSignInState (val) {
      if (val === 0) {
        Utils._POP_.toast('登录成功')
        this.isShowLoginPop = false
      } else if (val === 1) {
        Utils._POP_.toast('登录失败')
      }
    }
  }
}
</script>

<style lang="sass">
$headerHeight: 70px;
.mod_header {
  padding: 0 24px;
  height: $headerHeight;
  background-color: rgba(#fff, .92);
  border-bottom: 1px solid #e8e8e8;
  overflow: hidden;
}
.mod_header_logo {
  float: left;
  h1 {
    font-size: 24px;
  }
  a {
    display: block;
    line-height: $headerHeight; color: #6190E8;
  }
  img {
    margin-top: ($headerHeight - 40px)/2;
    width: 40px; height: 40px;
  }
  span {margin-left: 5px;}
}
.mod_header_nav {
  float: left;
  margin-left: 25px;
}
.mod_header_nav_wrap {
  overflow: hidden;
}
.mod_header_nav_item {
  float: left;
  border-bottom: 1px solid transparent;
  &.active {
    opacity: 1;
    border-bottom: 1px solid #6190E8;
  }
  div {
    display: block;
    padding: 0 24px;
    line-height: $headerHeight - 2px;
    font-size: 16px;
    opacity: .8;
    color: #6190E8;
  }
}
.mod_header_userpanel {
  float: right;
  height: $headerHeight;
}
.mod_header_userpanel_usermenu {
  margin-top: ($headerHeight - 30px)/2;
  height: 30px;
}
.mod_header_userpanel_usermenu_login {
  display: inline-block;
  padding: 0 15px;
  line-height: 28px;
  border: 1px solid #6190E8;
  color: #6190E8; border-radius: 3px;
}

/* 登录框 */
.loginpop {
  z-index: 3;
  position: fixed;
  top: 200px; left: 50%;
  margin-left: -150px;
  padding: 30px 30px 50px;
  width :300px;
  background: #fdfdfd;
  border: 1px solid #ccc;
  box-shadow: 0px 0px 0 10000px rgba(0, 0, 0, 0.1);
}
.loginpop_tit {
  font-size:16px;
  text-align: center;
}
.loginpop_input {
  margin-bottom: 10px;
  box-sizing: content-box;
  padding: 0;
  width: 100%; height: 30px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0;
  outline: none;
  box-shadow: none;
  transition: all 0.3s;
  &.focus {
    border-bottom: 1px solid #6190E8;
    box-shadow: 0 1px 0 0 #6190E8;
  }
}
.loginpop_btn {
  display: block;
  margin-top: 20px;
  height: 30px; line-height: 30px;
  text-align: center;
  background: #6190E8; color: #fff;
  opacity: .8;
  cursor: pointer;
  &:hover {opacity: 1;}
}
.loginpop_close {
  position: absolute;
  top: 10px; right: 10px;
  width:18px; height: 18px;
  cursor: pointer;
  &:before, &:after {
    content:'';
    position: absolute;
    top: 7px; left: 2px;
    width: 100%; height: 1px;
    background: rgba(#000, 0.6);
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
  &:hover {
    &:before, &:after {
      background:rgba(#000, 1);
    }
  }
}
</style>
