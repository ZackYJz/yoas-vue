<template>
		<view class="page">
			<uni-list>
				<uni-list-chat v-for="one in list" :key="one.id" :title="one.senderName"
					:note="one.msg" :avatar="one.senderPhoto" badgePositon="left"
					:badgeText="one.readFlag?'':'dot'" link="navigateTo"
					:to="'../message/message?id=' + one.id + '&readFlag=' + one.readFlag + '&refId=' + one.refId">
					<view class="chat-custom-right">
						<text class="chat-custom-text">{{one.sendTime}}</text>
					</view>
				</uni-list-chat>
			</uni-list>
		</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	export default {
			// 注册列表控件
			components:{
				uniList,
				uniListItem
			},
			data() {
				return {
					page:1,
					length:20,
					list:[],
					isLastPage:false
				}
			},
			// 页面显时加载第一页数据
			onShow:function(){
				let that=this
				//重置模型层数据
				that.page=1
				that.isLastPage=false
				uni.pageScrollTo({
					scrollTop:"0"
				})
				that.loadMessageList(that)
			},
			// 上滑触底的回调
			onReachBottom:function(){
				let that=this
				//是最后一页则不请求
				if(that.isLastPage){
					return
				}
				that.page=that.page+1
				that.loadMessageList(that)
			},
			methods: {
				// 加载分页数据
				loadMessageList:function(ref){
					let data={
						page:ref.page,
						length:ref.length
					}
					ref.ajax(ref.url.searchMessageByPage,"POST",data,function(resp){
						let result=resp.data.result
						// 没有查到数据
						if(result==null||result.length==0){
							ref.isLastPage=true
							ref.page=ref.page-1
							uni.showToast({
								icon:"none",
								title:"我也是有底线的"
							})
						}
						else{
							//如果是第一页（跳回列表页)
							if(ref.page==1){
								ref.list=[]
							}
							//list 数组合并 result
							ref.list=ref.list.concat(result)
							if(ref.page>1){
								uni.showToast({
									icon:"none",
									title:"加载了"+result.length+"条消息"
								})
							}
						}
					})
				}
			}
		}
</script>

<style lang="less">
	@import url("message_list.less");
</style>
