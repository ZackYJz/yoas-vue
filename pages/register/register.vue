<template>
	<view>
		<image src="../../static/logo-2.png" mode="widthFix" class="register-logo"></image>
		<view class="register-container">
			<input type="text" placeholder="入职邀请码" class="register-code" 
				maxlength="6" v-model="registerCode"/>
				<view class="register-dsc">管理员为你创建工牌账号后，你可以从个人邮箱中获得注册邀请码</view>
				<button class="register-btn" @tap="register()">现在注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				registerCode:''
			};
		},
		methods: {
			register:function(){
				// 参数校验
				let that = this;
				if(that.registerCode==null||that.registerCode.length==0){
					uni.showToast({
						icon:"none",
						title:"邀请码不能为空"
					})
					return
				}
				else if(/^[0-9]{6}$/.test(that.registerCode)==false){
					uni.showToast({
						icon:"none",
						title:"必须是6位数字"
					})
					return
				}
				uni.getUserProfile({
					desc:'获取用户信息',
					success: function(resp) {
						console.log(resp);
						let userInfo = resp.userInfo;
						let nickName = userInfo.nickName;
						let avatarUrl = userInfo.avatarUrl;
						// console.log(nickName);
						// console.log(avatarUrl);
					
						uni.login({
							provider:'weixin',
							success(resp) {
								let js_code = resp.code;
								let data = {
									code: js_code,
									nickname: nickName,
									photo: avatarUrl,
									registerCode: that.registerCode
								};
								that.ajax(that.url.register, 'POST', data, function(resp) {
									let permission = resp.data.permission;
									let token = resp.data.token;
									uni.setStorageSync('token', token);
									uni.setStorageSync('permission', permission);
									uni.switchTab({
										url: '../index/index'
									});
								});
							}
						})
					},
					fail:function(resp){
						console.log("faild:",resp);
					}
				})
		}
	}
};
</script>

<style lang="less">
	
</style>
