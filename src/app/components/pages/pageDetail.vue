<template>
<div class="page_detail">
	<div class="detail ly_box">
		<div class="detail_mobile">
			<div class="detail_mobile_screen">
				<iframe :src="'warehouse/'+$route.params.uuid+'/centroidnav.html'" frameborder="0" width="375px" height="667px"></iframe>
			</div>
		</div>
		<div class="detail_code">
			
		</div>
	</div>
</div>
	<!-- {{$route.params.uuid}} -->
</template>

<style>
.page_detail {overflow:hidden;}
	.detail {}
		.detail_mobile {width:416px;}
			.detail_mobile_screen {position:relative;width:416px;height:848px;background:url(../../img/iphone.jpg);}
				.detail_mobile_screen iframe {position:absolute;top:76px;left:50%;margin:0 0 0 -187px;border:1px solid #ddd;background:url(../../img/transparent.png);}
		.detail_code {-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;}
</style>

<script>
export default {

}
</script>