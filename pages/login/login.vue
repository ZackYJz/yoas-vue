<template>
	<view>
		<image src="../../static/logo-1.png" class="logo" mode = "widthFix"></image>
		<view class="logo-titile">企业在线办公系统</view>
		<view class="logo-subtitle">Ver 2021 beta</view>
		<button class="login-btn" open-type="getUserInfo" @tap="login()"> 登录系统</button>
		<view class="register-container">
			 没有账号？
			 <text class="register" @tap="toRegister()">立即注册</text>
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
			toRegister:function(){
				uni.navigateTo({
					url:"../register/register"
				})
			},
			login:function(){
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(resp) {
						let code = resp.code;
						let token = uni.getStorageSync('token');
						console.log("login token："+token);
						that.ajax(that.url.login, 'POST', { code: code }, function(resp) {
							let permission = resp.data.permission;
							uni.setStorageSync('permission', permission);
							//跳转到登陆页面
							uni.switchTab({
								url: '../index/index'
							});
						});
					},
					fail: function(e) {
						uni.showToast({
							icon: 'none',
							title: ' 系统异常'
						});
					}
				});
			}
		}
	}
</script>

<style lang="less">
	@import url("login.less");
</style>
