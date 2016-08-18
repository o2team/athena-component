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
		<!-- <div class="searchtag">
			<input class="searchtag_input" type="text" placeholder="搜索标签，输入后按下回车键" @keyup.enter="searchtag(searchTagName)" v-model="searchTagName">
		</div> -->
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
		<ul class="wlist">
			<li v-for="item in wlist" class="wlist_item">
				<div class="wlist_item_wrap">
					<a class="wlist_item_anchor" v-link="{ name:'detail', params:{id:item.id} }">{{item.attributes.name}}</a>
					<div class="wlist_item_tags">{{isItemTagsAddActive}}
						<ul class="wlist_item_tags_ul">
							<li v-for="y in item.attributes.tags" class="wlist_item_tags_item">
								<span>{{ y }}</span>
								<i class="close" @click="removeTag(item, y, $index)">&#xe606;</i>
							</li>
							<li class="wlist_item_tags_add">
								<div class="wlist_item_tags_add_button add">&#xe60b;</div>
								<div class="wlist_item_tags_add_button cancel">&#xe606;</div>
								<input class="wlist_item_tags_add_input" type="text" v-model="item.newTagName">
								<div class="wlist_item_tags_add_button confirm" @click="addTag(item, item.newTagName)">&#xe605;</div>
							</li>
						</ul>
					</div>
				</div>
			</li>
		</ul>
		<!-- <a class="more" href="javascript:;" @click="loadMore()" v-show="!search.isSearching">加载更多...</a> -->
	</div>
</div>
</template>

<style lang="sass">
/*.mod_footer {display: none !important;}*/

.plist {
	margin-left: 233px;
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
.wlist {
	padding-top: 81px;
	overflow: hidden;
}
.wlist_item {
	float: left;
	margin-right: 10px;
	margin-bottom: 10px;
	vertical-align: top;
	.wlist_item_wrap {
		min-width: 114px;
		max-width: 300px;
	}
	.wlist_item_anchor {
		display:block;
		padding:0 30px;
		height:24px;line-height:24px;
		border:1px solid #6190e8;
		font-size:12px;color:#6190e8;
		text-align: center;
	}
	.wlist_item_tags {
		
	}
	.wlist_item_tags_ul {
	
	}
	.wlist_item_tags_item {
		display: inline-block;
		margin-top: 5px;
		margin-right: 5px;
		padding: 0 10px;
		height: 22px; border-radius: 11px;
		font-size: 12px;
		background: #e4e4e4;
		i.close {
			position: relative;
			display: inline-block;
			margin-left: 5px;
			width: 11px; height: 15px;
			cursor: pointer;

			font-family: 'iconfont';
			font-size: 14px;
			color: #666;
			/*&:before, &:after {
				content:'';
				position: absolute;
				top: 7px; left: 2px;
				width: 100%; height: 1px;
				background: #000;
				transition: .2s ease;
			}
			&:before { transform: rotate(45deg); }
			&:after { transform: rotate(-45deg); }
			&:hover:before { transform: rotate(135deg); }
			&:hover:after { transform: rotate(45deg); }*/
		}
		span {
			display: inline-block;
			max-width: 200px;
			overflow: hidden; text-overflow: ellipsis;
		}
		span, i.close {
			/*line-height: 22px;*/
			vertical-align: middle;
		}
	}
	.wlist_item_tags_add {
		$btnw: 22px;
		$inpw: 70px;
		position: relative;
		/*display: inline-block;*/
		margin-top: 5px;
		/*margin-right: 5px;*/
		width: $btnw; height: $btnw; border-radius: $btnw;
		border: 1px solid #ccc;
		background: #e4e4e4;
		vertical-align: top;
		overflow: hidden;
		transition: .2s linear;
		.wlist_item_tags_add_input {
			position: absolute;
			top: 0; left: $btnw - 1;
			padding: 0 5px;
			height: $btnw - 2;
			width: $inpw;
			border: 1px solid #ccc;
			border-radius: 3px;
			outline: 0;
		}
		.wlist_item_tags_add_button {
			position: absolute;
			top: -1px;
			width: $btnw; height: $btnw; line-height: $btnw;
			border: 1px solid #ccc;
			border-radius: $btnw;
			cursor: pointer;
			background: #e4e4e4;
			font-family: 'iconfont';
			font-size: 12px;
			text-align: center;
			&.add, &.cancel {
				left: -1px;
			}
			&.cancel {
				display: none;
			}
			&.confirm {
				left: $btnw - 1 + $inpw;
			}
		}
		&.active {
			width: $btnw * 2 + $inpw;
			.wlist_item_tags_add_button.add {display: none;}
			.wlist_item_tags_add_button.cancel {display: block;}
		}
	}
}
.more {
	box-sizing: border-box;
	display: block;
	margin-top: 50px;
	width: 100%; height: 40px; line-height: 40px;
	font-size: 16px;
	border: 1px solid #6190e8;
	text-align: center;
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
</style>

<script>
export default {
	data () {
		return {
			// 用于按类别筛选组件列表
			state: {
				business: null,
				classify: null
			},
			
			wlist: [], // 用于渲染组件列表
			rawAllWidgets: [], // 记录全部组件不变

			blist: [], allWidgetCount: 0,
			classify: [],

			search: {
				isSearching: false,
				prewlist: null
			},
			searchTagName: ''
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
				query.equalTo('business', e);
				query.count().then(function (count) {
					that.blist.$set(i, Object.assign({}, e, {count:count}));
				});
			});
		});
		new AV.Query('Classify').find().then(function(results) {
			that.classify = results;
		});

		$('.wlist').on('click', '.wlist_item_tags_add_button.add, .wlist_item_tags_add_button.cancel', function() {
			$(this).parent().toggleClass('active');
		}).on('click', '.wlist_item_tags_add_button.confirm', function() {
			$(this).parent().removeClass('active');
		});
	},
	methods: {
		getWidgets: function() {
			var that = this;

			if(this.rawAllWidgets.length==0) {
				var query = new AV.Query('Widget');
				query.descending('createdAt');
				
				if(this.state.business) {
					var bus = AV.Object.createWithoutData('Business', this.state.business);
					query.equalTo('business', bus);
				}
				if(this.state.classify) {
					var cls = AV.Object.createWithoutData('Classify', this.state.classify);
					query.equalTo('business', cls);
				}
				
				query.find().then(function (results) {
  					that.wlist = results;
  					that.rawAllWidgets = [].concat(results);
				});
			} else {
				// 手动筛选，不用再重复请求数据了
				// 能不能像Angular一样使用filter呀

				var newArr = [];
				var stateBusiness = this.state.business;
				var stateClassify = this.state.classify;
				for( var i=0; i<this.rawAllWidgets.length; i++ ) {
					// 意思是如果不指定业务或类别，默认就通过了
					var bpass = !stateBusiness;
					var cpass = !stateClassify;

					if( stateBusiness ) {
						bpass = this.rawAllWidgets[i].attributes.business && this.rawAllWidgets[i].attributes.business.id === stateBusiness;
					}
					if( stateClassify ) {
						cpass = this.rawAllWidgets[i].attributes.classify && this.rawAllWidgets[i].attributes.classify.id === stateClassify;
					}

					if(bpass && cpass) {
						newArr.push( this.rawAllWidgets[i] );
					}
				}
				
				this.wlist = newArr;
			}
		},
		getAllWidgetsCount: function() {
			var that = this;
			new AV.Query('Widget').count().then(function(count) {
				that.allWidgetCount = count;
			});
		},
		searchtag: function(searchTagName) {
			var that = this;

			if(searchTagName) {
				var tagFilter = searchTagName;
				var query = new AV.Query('Widget');
				query.equalTo('tags', tagFilter);
				query.find().then(function(results) {
					// 如果之前的状态不也是搜索状态
					if(!that.search.isSearching) {
						that.search.prewlist = that.wlist;
					}
					that.wlist = results;
					that.search.isSearching = !!searchTagName;
				});
			} else {
				this.wlist = this.search.prewlist;
				that.search.isSearching = !!searchTagName;
			}
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
		},
		loadMore: function() {
			var that = this;
			var nowLen = this.wlist.length;

			var query = new AV.Query('Widget');
			query.descending('createdAt');
			query.limit(5);
			query.skip(nowLen);
			query.find().then(function (results) {
				if(results.length>0) {
					that.wlist = that.wlist.concat(results);
				} else {
					_POP_.toast('没有更多的数据了');
				}
			}, function (error) {
				
			});
		}
	},
	watch: {
		'state': {
			handler: function(value, oldValue) {
				this.getWidgets();
			},
			deep: true
		}
	}
}
</script>