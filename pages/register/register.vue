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
			
		}
	}
</script>

<style lang="less">
	@import url("register.less");
</style>
