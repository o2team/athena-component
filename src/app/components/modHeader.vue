<template>
	<div class="mod_header">
		<div class="mod_header_inner cf">
			<div class="mod_header_inner_l">
				<a class="mod_header_logo" v-link="{name:'list'}"><i>运营组件中心</i></a>
				<a class="mod_header_tit" v-link="{name:'list'}">
					运营构建组件库<br>
					<i>Building Component Library</i>
				</a>
			</div>
			<div class="mod_header_inner_r"></div>
		</div>
	</div>
</template>

<style>
.mod_header {border-bottom:1px solid hsla(0,0%,63%,.3);}
	.mod_header_inner {padding:10px 50px;}
		.mod_header_inner_l {float:left;}
			.mod_header_logo {display:inline-block;width:60px;height:60px;background:url(../img/logo-square-120.png);background-size:100%;overflow:hidden;vertical-align:middle;}
				.mod_header_logo i {display:block;margin-left:60px;}
			.mod_header_tit {display:inline-block;margin-left:25px;font-size:21px;line-height:1;color:#6190e8;vertical-align:middle;}
				.mod_header_tit i {font-size:14px;font-family:arial;}
		.mod_header_inner_r {float:right;}
</style>