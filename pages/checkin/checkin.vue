<template>
	<view>
		<camera device-position="front" flash="off" 
			class="camera" @error="noCamera" v-if="showCam"></camera>
			<image mode="widthFix" class="image" :src="photoPath" v-if="showImage"></image>
			<view class="operate-container">
				<button type="primary" class="btn" @tap="clickBtn" :disabled="!canCheckin">{{btnText}}</button>
				<button type="warn" class="btn" @tap="afresh" :disabled="!canCheckin">重新拍摄</button>
			</view>
			<view class="notice-container">
				<text class="notice">注意事项</text>
				<text class="desc">拍照签到的时候，必须要拍摄自己的正面照片，侧面照片会导致无法识别。另外，拍照的时候不要戴墨镜或者帽子，避免影响拍照签到的准确度。</text>
			</view>
	</view>
</template>

<script>
	var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
	var qqMapsdk;
	export default {
		data() {
			return {
				canCheckin:true,
				photoPath:'',
				btnText:'拍照',
				showCam:true,
				showImage:false
			}
		},
		onLoad:function(){
			qqMapsdk=new QQMapWX({
				key:"ATVBZ-ANJK4-VEJUV-XRDYD-GVYJ3-ISBIQ"
			})
		},
		//页面载入时判断当前是否允许考勤
		onShow:function(){
		// 	let that = this
		// 	that.ajax(that.url.validCanCheckIn,"GET",null,function(resp){
		// 		let msg = resp.data.msg
		// 		if(msg!="可以考勤"){
		// 			that.canCheckin = false
		// 			setTimeout(function(){
		// 				uni.showToast({
		// 					icon:"none",
		// 					title:msg
		// 				})
		// 			}
		// 		)
		// 	}
		// })
		},
		methods: {
			//点击主按钮（拍照/签到）
			clickBtn: function() {
				let that = this;
				if (that.btnText == '拍照') {
					// 获得摄像头上下文对象
					let ctx = wx.createCameraContext();
					ctx.takePhoto({
						quality: 'high',
						success: function(resp) {
							//打印拍照图片路径
							console.log(resp.tempImagePath);
							// 赋值到 外层的 photoPath
							that.photoPath = resp.tempImagePath;
							// 隐藏摄像头
							that.showCam = false;
							// 显示图片
							that.showImage = true;
							// 更改 文字
							that.btnText = '签到';
						}
					});
				} 
				else {
					//这里是点击签到按钮
					uni.showLoading({
						title:"签到中,请稍后...👀"
					})
					setTimeout(function(){
						uni.hideLoading()
					},20000)
					uni.getLocation({
						success:function(resp){
							let latitude=resp.latitude
							let longitude = resp.longitude
							console.log(" 纬度: "+latitude)
							console.log(" 经度: "+longitude)
							qqMapsdk.reverseGeocoder({
								location:{
									latitude:latitude,
									longitude:longitude
								},
								success:function(resp){
									//console.log(resp.result);
									let address = resp.result.address;
									let addressComponent = resp.result.address_component;
									let nation = addressComponent.nation;
									let province = addressComponent.province;
									let city = addressComponent.city;
									let district = addressComponent.district;
									uni.uploadFile({
										url:that.url.checkin,
										filePath:that.photoPath,
										name:"photo",
										header:{
											token:uni.getStorageSync("token"),
										},
										formData:{
											address:address,
											country:nation,
											province:province,
											city:city,
											district:district
										},
										success:function(resp){
											if(resp.statusCode == 500 && resp.data == "人脸数据不存在🙄"){
												uni.hideLoading()
												uni.showModal({
													title:"提示",
													content:"人脸数据不存在，是否以当前照片录入人脸数据🤔",
													success:function(res){
														if(res.confirm){
															uni.uploadFile({
																url:that.url.createFaceModel,
																filePath:that.photoPath,
																name:"photo",
																header:{
																	token:uni.getStorageSync("token")
																},
																success:function(resp){
																	if(resp.statusCode == 500){
																		uni.showToast({
																			icon:"none",
																			title:resp.data
																		})
																	}else if(resp.statusCode==200){
																		uni.showToast({
																			icon:"none",
																			title:"人脸数据保存成功 🙂",
																		})
																	}
																}
														})
													  }
													}
												})
										}else if(resp.statusCode == 200){  //签到成功
											// 解析 resp 中的 json 数据
											let data = JSON.parse(resp.data);
											// 获取业务状态码
											let code = data.code;
											// 获取业务提示消息
											let msg = data.msg;
											if(code == 200){  //业务状态码也是 200 时签到成功
												// 隐藏等待框
												 uni.hideLoading()
												 uni.showToast({
													title:" 签到成功 🙂",
													complete:function(){
														//吐司消息播放结束后的回调
														uni.navigateTo({
															url:'../checkin_result/checkin_result'
														})
													}
												 })
											}
										}else if(resp.statusCode == 500){
											//其他类型的异常->消息提示
											uni.showToast({
												icon:"none",
												title:resp.data
											})
										  }
										}
									})
								}
							})
						}
					})
				}
			},
			afresh: function() {
				this.showCam = true;
				this.showImage = false;
				this.btnText = '拍照';
			}
		}
	}
</script>

<style lang="less">
	@import url("checkin.less");
</style>
