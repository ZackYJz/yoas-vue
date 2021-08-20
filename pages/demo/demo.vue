<template>
	<view>
		<h2>My name is {{zackyj}}</h2>
		<view v-for = "tel in tels">{{tel}}</view>
		<view v-if="age >= 18">
			<button @tap="watch()">已满 18 岁，点击观看</button>
		</view>
		<view>
			<input type="text" v-model="msg" placeholder="你想说什么"/>
		</view>
		<view>
			你说："{{msg}}",我说确实如此。
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username:"zackyj",
				tels:['1333333333','144444444','155555555'],
				age:20,
				msg:''
			}
		},
		methods: {
			 watch:function(){
				 uni.showToast({
				 	title:"观看完毕"
				 })
			 }
		}
	}
</script>

<style>

</style>
