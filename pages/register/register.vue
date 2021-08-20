<template>
	<view>
		<image src="../../static/logo-2.png" mode="widthFix" class="register-logo"></image>
		<view class="register-container">
			<input type="text" placeholder="入职邀请码" class="register-code" 
				maxlength="6" v-model="registerCode"/>
				<view class="register-dsc">管理员为你创建工牌账号后，你可以从个人邮箱中获得注册邀请码</view>
				<button class="register-btn" open-type="getUserInfo" @tap="register">现在注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			register:function(){
				//调用 获取登录信息 接口
				uni.login({
					provider:"weixin",
					// 成功回调
					success:function(resp){
						// 临时授权字符串
						let js_code = resp.code;
						console.log('code: '+js_code);
						//  获取用户账号基本信息
						uni.getUserInfo({
							provider:'weixin',
							success:function(resp){
								let nickName = resp.userInfo.nickName;
								let avatarUrl = resp.userInfo.avatarUrl;
								console.log(avatarUrl);
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="less">
	@import url("register.less");
</style>
