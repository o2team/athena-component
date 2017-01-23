<template>
<div class="mod_container">
  <router-view name="header"></router-view>

  <router-view :user="user"></router-view>

  <mod-footer :user="user"></mod-footer>
</div>
</template>

<script>
import modHeader from './components/Header.vue'
import modFooter from './components/Footer.vue'

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

<style>
.mod_container {
}
.mod_wrap {
}
</style>
