<template>
<mod-header :user="user"></mod-header>

<div class="mod_container">
	<router-view :user="user"></router-view>
</div>

<mod-footer :user="user"></mod-footer>
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
  	},
  	data () {
  		return {
  			// 用户信息
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
  	}
}
</script>