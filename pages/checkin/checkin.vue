<template>
	<view>
		<camera device-position="front" flash="off" 
			class="camera" @error="noCamera" v-if="showCam"></camera>
			<image mode="widthFix" class="image" :src="photoPath" v-if="showImage"></image>
			<view class="operate-container">
				<button type="primary" class="btn" @tap="clickBtn" :disabled="canCheckin">{{btnText}}</button>
				<button type="warn" class="btn" @tap="afresh" :disabled="canCheckin">重新拍摄</button>
			</view>
			<view class="notice-container">
				<text class="notice">注意事项</text>
				<text class="desc">拍照签到的时候，必须要拍摄自己的正面照片，侧面照片会导致无法识别。另外，拍照的时候不要戴墨镜或者帽子，避免影响拍照签到的准确度。</text>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				canCheckin:false,
				photoPath:'',
				btnText:'拍照',
				showCam:true,
				showImage:false
			}
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
