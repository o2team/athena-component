<template>
<div class="mod_psepage">
	<mod-header></mod-header>
	<div class="mod_container">
		<router-view></router-view>
	</div>
</div>

<mod-footer></mod-footer>
</template>

<style>
.mod_psepage {padding-bottom:120px;min-height:100%;_height:100%;margin-bottom:-120px;}
	.mod_container {padding:20px;}
</style>

<script>
import modHeader from './modHeader.vue'
import modFooter from './modFooter.vue'

export default {
	replace: true,
  	components: {
  	  	modHeader,
  	  	modFooter
  	}
}
</script>