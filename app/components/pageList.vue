<style lang="sass">
/* 组件搜索 */
.plist_search {
	padding: 71px 0 10px;
	.plist_search_inp {
		box-sizing: border-box;
		padding: 10px; width: 100%;
		border: 1px solid #6190e8; background: #f8f8f8; text-align: center;
		&:focus {background: #fff;}
	}
}
				
.plist {
	margin-left: 233px;
	background: #f4f4f4;
	.plist_wrap {
		margin: 0 auto;
		width: 1590px;
		@media screen and (max-width: 1822px) {
	    	width: 1272px;
		}
		@media screen and (max-width: 1504px) {
    		width: 954px;
		}
		@media screen and (max-width: 1186px) {
    		width: 636px;
		}
		@media screen and (max-width: 868px) {
    		width: 318px;
    	}
	}
	.plist_header {
		z-index: 1;
		position: fixed; top: 71px; left: 233px; right: 0;
		padding: 10px 20px;
		height: 40px;
		border-bottom: 1px solid #e8e8e8;
		background: rgba(253, 253, 253, .9);
		li {
			display: inline-block;
			margin-left: 10px;
			line-height: 40px;
			&:first-child {
				margin-left: 0;
			}
		}
		a {
			padding: 3px 10px;
			border: 1px solid #6190E8;
			border-radius: 2px;
			background: rgba(97, 144, 232, .9);
			color: #fff;
		}
		li.active {
			a {
				background: transparent;
				color: #333;
			}		
		}
	}
}

.searchtag {
	margin-bottom: 50px;
	.searchtag_input {
		box-sizing: border-box;
		display: block; 
		padding: 10px;
		width: 100%;
		border: 1px solid #6190e8;
		background: #f8f8f8;
		text-align: center;
		&:focus {
			background: #fff;
		}
	}
}

.mod_aside {
	position: absolute;
    top: 71px; bottom: 120px; left: 0;
	/*margin-bottom: -9999px; */
	/*padding-bottom: 9999px; */
    width: 232px;
    background-color: #fff;
    border-right: 1px solid #e8e8e8;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 8px;
        background-color: #F5F5F5;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: #555;
        background-color: rgba(0,0,0,.5);
    }
    &::-webkit-scrollbar-track {
        border-radius: 5px;
        background-color: #f1f1f1;
    }
    .mod_aside_header {
    	padding: 10px 25px;
    	border-bottom: 1px solid #e8e8e8;
    	h2 {height: 40px; line-height: 40px; font-size: 20px;}
    }
    .mod_aside_list {
    	ul {}
    	.mod_aside_list_item {
    		padding: 10px 25px;
    		height: 28px;
    		border-top: 1px solid transparent;
    		border-bottom: 1px solid transparent;
    		cursor: pointer;
            &.active {
                background-color: #fff5ee;
                border-color: #f8d4bc;
                .mod_aside_list_item_name {
                    color: #f60;
                }
                .mod_aside_list_item_count {
                    background-color: #ffb17e;
                    border-color: #ffb17e;
                    color: #fff;
                }
            }
    	}
    	.mod_aside_list_item_name {
    		float: left;
    		line-height: 28px; font-size: 14px; color: #727272;
    	}
    	.mod_aside_list_item_count {
    		float: right;
    		height: 20px; margin-top: 3px; padding: 0 8px; line-height: 20px; font-size: 12px; border: 1px solid #e8e8e8; border-radius: 12px; cursor: default;
    	}
    }
}
.wlist {
	margin: 0 -10px;
	overflow: hidden;
}
/* 组件项 */
.wlist_item {
	position: relative;
	width: 227px;
	float: left;
	margin: 0 10px 10px;
	vertical-align: top;
	.wlist_item_wrap {
		display: block;
		height: 257px; 
		min-width: 114px;
		max-width: 300px;
		background: #fff; 
		border: 1px solid transparent; border-bottom: 1px solid #ccc; 
		overflow: hidden; 
		-webkit-transition: .6s ease; transition: .6s ease;
	}
	.wlist_item_show {
		height: 225px;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAV1gAAFdYB1mtZ/QAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAXdEVYdENyZWF0aW9uIFRpbWUAMjAxNi4yLjE5feXuqAAAAElJREFUOI3t0bEJwEAMQ1EpZIzbfzAt8q9KaZEikObUyjyMbQANAZREZUTX2LzMAT4A7vYiQLY7kGQsbWutVZG6wYM04P8jHkDaCZEYwmwI7+IAAAAASUVORK5CYII=);
		overflow: hidden;
		img {
			width: 100%;
		}
	}
	.wlist_item_info {
		height: 32px; 
		background: #fff; 
		-webkit-transition: .3s ease; transition: .3s ease;
	}
	.wlist_item_name {
		height: 32px; line-height: 32px; 
		white-space: nowrap; word-wrap: normal; overflow: hidden; text-overflow: ellipsis; 
		text-align: center;
	}
	.wlist_item_meta {
		padding: 0 10px; 
		height: 30px;
		> div {
			float: left; 
			width: 50%; height: 30px; line-height: 30px;
		}
	}
	.wlist_item_meta_pulltimes {
		text-align: right;
	}
	.wlist_item_del {
		position: absolute;
		top: 0; left: 0;
		width: 100%; height: 100%;
		background: rgba(0,0,0,0.7);
		text-align: center;
		cursor: pointer;
		&:before {
			content: '';
			display: inline-block;
			width: 0; height: 100%;
			font-size: 0;
		}
		&:before, .wlist_item_del_btn {
			vertical-align: middle;
		}
		.wlist_item_del_btn {
			display: inline-block;
			padding: 3px 20px;
			border-radius: 2px;
			background: #df3e3e;
			color: #fff;
			&:hover {
				background: #db2828;
			}
		}
	}
	&:hover {
		.wlist_item_wrap {
			border: 1px solid orange;
		}
		.wlist_item_info {
			-webkit-transform: translate(0, -30px); transform: translate(0, -30px);
		}
	}
}
				
/* 管理 */
.manage {
	position: fixed;
	padding: 5px 10px;
	bottom: 20px; right: 20px;
	border-radius: 4px;
	background: #6190e8;
	color: #fff;
}
</style>

<template>
<aside class="mod_aside">
	<div class="mod_aside_header">
		<h2>业务导航</h2>
	</div>
	<div class="mod_aside_list">
		<h3></h3>
		<ul>
			<li class="mod_aside_list_item" 
				v-bind:class="{'active': !state.business}"
				@click="state.business = null">
				<span class="mod_aside_list_item_name">全部</span>
				<span class="mod_aside_list_item_count">{{ allWidgetCount }}</span>
			</li>
			<li class="mod_aside_list_item" 
				v-for="item in blist" 
				v-bind:class="{'active': state.business == item.id}"
				@click="state.business = item.id">
				<span class="mod_aside_list_item_name">{{ item.attributes.name }}</span>
				<span class="mod_aside_list_item_count">{{ item.count || 0 }}</span>
			</li>
		</ul>
	</div>
</aside>

<div class="plist">
	<div class="plist_wrap">
		<div class="plist_header">
			<ul>
				<li 
					v-bind:class="{'active': !state.classify}"
					@click="state.classify = null">
					<a href="javascript:;">不限</a>
				</li>
				<li 
					v-for="item in classify" 
					v-bind:class="{'active': state.classify == item.id}" 
					@click="state.classify = item.id">
					<a href="javascript:;">{{ item.attributes.name }}</a>
				</li>
			</ul>
		</div>

		<!-- S 组件搜索 -->
		<div class="plist_search"><input class="plist_search_inp" type="text" placeholder="输入组件名搜索" v-model="state.searchName"></div>
		<!-- E 组件搜索 -->

		<ul class="wlist">
			<!-- S 组件项 -->
			<li v-for="item in wlist | filterBy state.searchName in 'attributes.name' | filterBy state.classify in 'attributes.classify' | filterBy state.business in 'attributes.business'" class="wlist_item">
				<a class="wlist_item_wrap" v-link="{ name:'detail', params:{id:item.id} }">
					<div class="wlist_item_show"><img :src="'warehouse/_build/'+item.id+'/capture.png'" onerror="this.src='http://jdc.jd.com/img/200x100?color=5CC26F&textColor=fff&text=No Capture'"></div>
					<div class="wlist_item_info">
						<div class="wlist_item_name">{{item.attributes.name}}</div>
						<div class="wlist_item_meta">
							<div class="wlist_item_meta_author">{{item.attributes.author}}</div>
							<div class="wlist_item_meta_pulltimes" title="拉取次数">{{item.attributes.pullTimes}}</div>
						</div>
					</div>
				</a>
				<div class="wlist_item_del" v-show="isManageMode" @click="delWidget(item.id, $index)"><div class="wlist_item_del_btn">删除</div></div>
			</li>
			<!-- E 组件项 -->
		</ul>
	</div>
</div>
{{ '123' + user.init() }}
<a class="manage" @click="toggleManage" href="javascript:;" v-show="user.hasLogin">切换管理模式</a>
</template>

<script>
export default {
	props: ['user'],
	data () {
		return {
			// Filter 条件
			state: {
				business: null,
				classify: null,
				searchName: ''
			},

			// 管理模式
			isManageMode: false,
			
			// 渲染列表
			wlist: [],
			
			blist: [], allWidgetCount: 0,
			classify: [],

			search: {
				isSearching: false,
				prewlist: null
			}
		}
	},
	ready () {
  		var that = this;

  		this.getWidgets();
  		this.getAllWidgetsCount();

		new AV.Query('Business').find().then(function(results) {
			that.blist = results;
			
			// 计数，有点蛋疼，里层异步赋值不刷新视图？
			that.blist.forEach(function(e, i) {
				var query = new AV.Query('Widget');
				query.notEqualTo('state', 0);
				query.equalTo('business', e);
				query.count().then(function (count) {
					that.blist.$set(i, Object.assign({}, e, {count:count}));
				});
			});
		});
		new AV.Query('Classify').find().then(function(results) {
			that.classify = results;
		});
	},
	methods: {
		// 删除组件
		delWidget: function (itemId, index) {
			var that = this;
			if(confirm('确定要删除该组件吗')) {
				var w = AV.Object.createWithoutData('Widget', itemId);
				w.set('state', 0);
				w.save().then(function (data) {
					_POP_.toast('删除成功');
					that.wlist.splice(index, 1);
				}, function (error) {
					_POP_.toast('删除失败');
				});
			}
		},
		// 切换管理模式
		toggleManage: function () {
			this.isManageMode = !this.isManageMode;
		},
		// 获取组件
		getWidgets: function() {
			var that = this;

			var query = new AV.Query('Widget');
			query.descending('createdAt');
			// query.descending('pullTimes');
			query.notEqualTo('state', 0);
			query.find().then(function (results) {
  				that.wlist = results;
			});
		},
		// 获取组件总数
		getAllWidgetsCount: function() {
			var that = this;
			new AV.Query('Widget').notEqualTo('state', 0).count().then(function(count) {
				that.allWidgetCount = count;
			});
		},
		addTag: function(item, newTagName) {
			if(!newTagName) {
				_POP_.toast('标签为空');
				return;
			}
			var that = this;
			// 存储TAG
			var w = new AV.Object.createWithoutData('Widget', item.id);
			w.addUnique('tags', [newTagName]);
			w.save().then(function (w) {
				item.attributes.tags.push(newTagName);
				item.newTagName = '';
				_POP_.toast('添加成功');
			}, function (error) {
				_POP_.toast('添加失败');
			});
		},
		removeTag: function(item, y, index) {
			var that = this;
			var w = AV.Object.createWithoutData('Widget', item.id);
			w.remove('tags', [y]);
			w.save().then(function (success) {
				item.attributes.tags.splice(index, 1);
  				_POP_.toast('删除成功');
			}, function (error) {
  				_POP_.toast('删除失败');
			});
		}
	},
	watch: {
		// 'state': {
		// 	handler: function(value, oldValue) {
		// 		this.getWidgets();
		// 	},
		// 	deep: true
		// }
	}
}
</script>