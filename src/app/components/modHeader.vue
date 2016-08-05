<template>
<div class="mod_header">
	<div class="mod_header_inner cf">
		<div class="mod_header_inner_l ly_valign">
			<div class="ly_valign_wrap">
				<a class="mod_header_logo" v-link="{name:'list'}"><i>运营组件中心</i></a>
				<a class="mod_header_tit" v-link="{name:'list'}">运营构建组件库<br><i>Building Component Library</i></a>
				<ul class="mod_header_nav cf">
					<li class="mod_header_nav_item"><a v-link="{path: '/list', name:'list'}">组件</a></li>
					<li class="mod_header_nav_item"><a v-link="{path: '/white', name:'white'}" v-show="user.hasLogin">白名单</a></li>
				</ul>
			</div>
			<!--[if lt IE 8]><span class="ly_valign_after"></span><![endif]-->
		</div>
		<div class="mod_header_inner_r ly_valign">
			<div class="ly_valign_wrap">
				<a class="mod_header_login" href="javascript:;"  @click="isShowLoginPop = true" v-show="!user.hasLogin">登录</a>
				<div v-show="user.hasLogin">
					<span style="margin-right: 30px;">欢迎您，{{ user.username }}</span>
					<a class="mod_header_login" href="javascript:;"  @click="logout">退出</a>
				</div>
			</div>
			<!--[if lt IE 8]><span class="ly_valign_after"></span><![endif]-->
		</div>
	</div>
</div>

<div class="loginpop" v-show="isShowLoginPop">
	<h2 class="loginpop_tit">登录</h2>
	<input class="loginpop_input" type="text" placeholder="用户名" v-model="loginUsername">
	<input class="loginpop_input" type="password" placeholder="密码" v-model="loginPassword">
	<a class="loginpop_btn" href="javascript:;" @click="login(loginUsername, loginPassword)">登录</a>
	<div class="loginpop_close" @click="isShowLoginPop = false"></div>
</div>
</template>

<style>
.mod_header {border-bottom:1px solid hsla(0,0%,63%,.3);}
	.mod_header_inner {padding:0 50px; height: 80px;}
		.mod_header_inner_l {float:left; height: 100%;}
			.mod_header_logo {display:inline-block;width:60px;height:60px;background:url(../img/logo-square-120.png);background-size:100%;overflow:hidden;vertical-align:middle;}
				.mod_header_logo i {display:block;margin-left:60px;}
			.mod_header_tit {display:inline-block;margin-left:25px;font-size:21px;line-height:1;color:#6190e8;vertical-align:middle;}
				.mod_header_tit i {font-size:14px;font-family:arial;}
			.mod_header_nav {display:inline-block; margin-left: 30px; vertical-align: middle;}
				.mod_header_nav_item {float: left;}
					.mod_header_nav_item a {display: block; margin-left:5px; padding: 5px 0; width: 60px; text-align: center; border-bottom: 2px solid transparent; font-size: 16px;}
					.mod_header_nav_item a:hover, .mod_header_nav_item a.v-link-active {border-bottom: 2px solid #6190e8}
		.mod_header_inner_r {float:right; height: 100%;}
			.mod_header_login {}
.loginpop {
	z-index: 3;
	position: fixed; top: 200px; left: 50%; width :300px; height: 200px; margin-left: -150px;
	padding: 30px;
	background: #fdfdfd; border: 1px solid #ccc;
}
	.loginpop_tit {font-size:16px; text-align: center;}
	.loginpop_input {
		margin-bottom: 5px;
		box-sizing: content-box;
		padding: 0;
		width: 100%; height: 30px;
		background-color: transparent;
		border: none; border-bottom: 1px solid #9e9e9e;
		border-radius: 0; outline: none; box-shadow: none;
		transition: all 0.3s;
	}
	.loginpop_input:focus {
		border-bottom: 1px solid #26a69a;
		box-shadow: 0 1px 0 0 #26a69a;
	}
	.loginpop_btn {display: block; margin-top: 20px; height: 30px; line-height: 30px; text-align: center; background: #009A61; color: #fff;}
	.loginpop_btn:hover {background:#00B371;}
	.loginpop_close {position: absolute; top: 10px; right: 10px; width:18px; height: 18px; cursor: pointer;}
	.loginpop_close:before, .loginpop_close:after {
		content:'';
		position: absolute;
		top: 7px; left: 2px;
		width: 100%; height: 1px;
		background: rgba(0,0,0,0.6);
	}
	.loginpop_close:before { transform: rotate(45deg); }
	.loginpop_close:after { transform: rotate(-45deg); }
	.loginpop_close:hover:before, .loginpop_close:hover:after {background:rgba(0,0,0,1);}
</style>

<script>
export default {
	events: {
		Auth : function(currentUser) {
			this.user.init(currentUser);
		},
	},
	ready () {
  		var that = this;

  		// 请求白名单列表
		var query = new AV.Query('Account');
		query.find().then(function (results) {
  			that.wlist = results;
		}, function (error) {

		});
	},
	data () {
		return {
			wlist: [],
			addAccountName: '',
			isShowLoginPop: false,
			loginUsername: '',
			loginPassword: '',
			user: {
				init: function(currentUser) {
					this.hasLogin = !!currentUser;
					if(currentUser) {
						this.username = currentUser.attributes.username;
					}
				},
				destory: function() {
					this.hasLogin = false;
					this.username = '';
				},
				hasLogin: false,
				username: ''
			}
		}
	},
	methods: {
		login: function(uname, pass) {
			if(!uname) { _POP_.toast('用户名为空'); return; }
			if(!pass) { _POP_.toast('密码为空'); return; }
			var that = this;

			AV.User.logIn(uname, pass).then(function (loginedUser) {
				_POP_.toast('登录成功');
				that.isShowLoginPop = false;

				that.user.init(loginedUser);

			}, function (error) {
				_POP_.toast('登录失败');
			});
		},
		logout: function() {
			AV.User.logOut();
			this.user.destory();
			_POP_.toast('用户登出');
		}
	}
}
</script>