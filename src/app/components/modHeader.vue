<template>
<header class="mod_header">
	<div class="mod_header_main">
		<div class="mod_header_logo">
			<h1>
				<a v-link="{name:'list'}" href="javascript:;">
					<img src="../img/logo-square-120.png">
					<span>运营组件库</span>
				</a>
			</h1>
		</div>
		<nav class="mod_header_nav">
			<ul>
				<li v-link="{path: '/list', name:'list', activeClass: 'active'}"><a href="javascript:;">组件</a></li>
				<li v-link="{path: '/white', name:'white', activeClass: 'active'}" v-show="user.hasLogin"><a href="javascript:;">白名单</a></li>
			</ul>
		</nav>
		<div class="mod_header_userpanel">
			<div class="mod_header_userpanel_usermenu">
				<a class="mod_header_userpanel_usermenu_login" href="javascript:;" @click="isShowLoginPop = true" v-show="!user.hasLogin">登录</a>
				<div v-show="user.hasLogin">
					<span>欢迎您，{{ user.username }}</span>
					<a @click="logout" href="javascript:;">退出</a>
				</div>
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
</header>
</template>

<style lang="sass">
$headerHeight: 70px;
.mod_header {
	z-index: 3;
	position: fixed; top: 0; right: 0; left: 0;
	height: $headerHeight; background-color: rgba(255,255,255,.92); border-bottom: 1px solid #e8e8e8;
	.mod_header_main {
		padding: 0 24px;
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
		img	{
			margin-top: ($headerHeight - 40px)/2;
			width: 40px; height: 40px;
		}
		span {margin-left: 5px;}
	}
	.mod_header_nav {
		float: left;
		margin-left: 25px;
		ul {overflow: hidden;}
		li {
			float: left; border-bottom: 1px solid transparent;
			&.active {
				opacity: 1;
				border-bottom: 1px solid #6190E8;
			}
		}
		a {
			display: block; padding: 0 24px; 
			line-height: $headerHeight; 
			font-size: 16px;
			opacity: .8; color: #6190E8;
		}
	}
	.mod_header_userpanel {
		float: right;
		height: $headerHeight;
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
	}

	/* 登录框 */
	.loginpop {
		z-index: 3;
		position: fixed; top: 200px; left: 50%; width :300px; margin-left: -150px;
		padding: 30px 30px 50px;
		background: #fdfdfd; border: 1px solid #ccc;
		box-shadow: 0px 0px 0 10000px rgba(0,0,0,0.1);
		.loginpop_tit {font-size:16px; text-align: center;}
		.loginpop_input {
			margin-bottom: 10px;
			box-sizing: content-box;
			padding: 0;
			width: 100%; height: 30px;
			background-color: transparent;
			border: none; border-bottom: 1px solid #9e9e9e;
			border-radius: 0; outline: none; box-shadow: none;
			transition: all 0.3s;
		}
		.loginpop_input:focus {
			border-bottom: 1px solid #6190E8;
			box-shadow: 0 1px 0 0 #6190E8;
		}
		.loginpop_btn {display: block; margin-top: 20px; height: 30px; line-height: 30px; text-align: center; background: #6190E8; color: #fff; opacity: .8; }
		.loginpop_btn:hover {opacity: 1;}
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
	}
}

/*相关性*/
.mod_container {
	padding-top: $headerHeight + 1;
}
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