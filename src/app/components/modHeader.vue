<template>
<div class="mod_header">
	<div class="mod_header_inner cf">
		<div class="mod_header_inner_l ly_valign">
			<div class="ly_valign_wrap">
				<a class="mod_header_logo" v-link="{name:'list'}"><i>运营组件中心</i></a>
				<a class="mod_header_tit" v-link="{name:'list'}">运营构建组件库<br><i>Building Component Library</i></a>
				<ul class="mod_header_nav cf">
					<li class="mod_header_nav_item"><a v-link="{path: '/list', name:'list'}">组件</a></li>
					<li class="mod_header_nav_item"><a v-link="{path: '/white', name:'white'}">白名单</a></li>
				</ul>
			</div>
			<!--[if lt IE 8]><span class="ly_valign_after"></span><![endif]-->
		</div>
		<div class="mod_header_inner_r ly_valign">
			<div class="ly_valign_wrap">
				<a class="mod_header_login" href="javascript:;" style="display:none">登录</a>
			</div>
			<!--[if lt IE 8]><span class="ly_valign_after"></span><![endif]-->
		</div>
	</div>
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
</style>