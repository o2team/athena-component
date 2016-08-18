<template>
<mod-header></mod-header>

<div class="mod_container">
	<router-view></router-view>
</div>

<mod-footer></mod-footer>
</template>

<style>
.mod_container {
	box-sizing: border-box;
	position: relative;
	padding-bottom:120px;min-height:100%;_height:100%;margin-bottom:-120px; 
}
.mod_wrap {
	/*margin: 0 auto; max-width: 1400px;*/
}
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