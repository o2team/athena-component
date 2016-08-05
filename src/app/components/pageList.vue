<template>
<div class="mod_wrap">
	<div class="searchtag">
		<input class="searchtag_input" type="text" placeholder="搜索标签，输入后按下回车键" @keyup.enter="searchtag(searchTagName)" @change="recoverFromSearch(searchTagName)" v-model="searchTagName">
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
	<a class="more" href="javascript:;" @click="loadMore()">加载更多</a>
</div>
</template>

<style lang="sass">
.searchtag {
	margin-bottom: 50px;
	.searchtag_input {
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
	display: block;
	margin-top: 50px;
	width: 100%; height: 30px; line-height: 30px;
	border: 1px solid #6190e8;
	text-align: center;
}

</style>

<script>
export default {
	ready () {
  		var that = this;

  		var query = new AV.Query('Widget');
		query.descending('createdAt');
		query.limit(5);
		query.find().then(function (results) {
  			that.wlist = results;
		}, function (error) {
			
		});

		$('.wlist').on('click', '.wlist_item_tags_add_button.add, .wlist_item_tags_add_button.cancel', function() {
			$(this).parent().toggleClass('active');
		}).on('click', '.wlist_item_tags_add_button.confirm', function() {
			$(this).parent().removeClass('active');
		});
	},
	data () {
		return {
			wlist: [],
			prewlist: [],
			searchTagName: ''
		}
	},
	methods: {
		searchtag: function(searchTagName) {
			if(!searchTagName) { return; }
			var that = this;
			var tagFilter = searchTagName;
			var query = new AV.Query('Widget');
			query.equalTo('tags', tagFilter);
			query.find().then(function(results) {
				that.prewlist = that.wlist;
				that.wlist = results;
			});
		},
		recoverFromSearch: function(searchTagName) {
			if(!searchTagName) {
				this.wlist = this.prewlist;
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
	}
}
</script>