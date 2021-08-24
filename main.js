import App from './App'
import Vue from 'vue'


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()

//全局 URL

let baseUrl_local = "http://localhost:8083/emos-wx-api"
let natappUrl = "https://zackyj.mynatapp.cc/emos-wx-api"

let baseUrl = natappUrl
Vue.prototype.url={
	register:baseUrl+"/user/register",
	login:baseUrl + "/user/login",
	//签到
	checkin: baseUrl + "/checkin/checkin",
	//创建人脸模型
	createFaceModel: baseUrl + "/checkin/createFaceModel",
	//查看当天是否允许签到
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn",
	//查询当天签到状态
	searchTodayCheckin: baseUrl + "/checkin/searchTodayCheckin",
	searchUserSummary: baseUrl + "/user/searchUserSummary"
}

// 全局权限验证
Vue.prototype.checkPermission = function(perms) {
	let permission = uni.getStorageSync("permission")
	let result = false
	for (let one of perms) {
		if (permission.indexOf(one) != -1) {
			result = true
			break
		}
	}
	return result
}

//全局 Ajax 封装对象
Vue.prototype.ajax = function(url,method,data,fun){
	uni.request({ 
		"url":url,  //请求 URL
		"method":method,  //请求方法
		"header":{  //从 localStorage 中获得 token，附在请求头中提交
			token:uni.getStorageInfoSync('token')
		},
		"data":data,   //请求体中的数据
		//请求处理成功的回调
		success:function(resp){
			 // 响应 状态码401：未登录
			 if(resp.statusCode == 401){
				  uni.redirectTo({
				  	url:'../login/login'
				  });
			//响应状态码和业务状态码都为 200：登录成功
			 }else if(resp.statusCode == 200&&resp.data.code == 200){
				 let data = resp.data
				 //响应对象有token 字段——登录注册成功或刷新了 token
				 if(data.hasOwnProperty("token")){
					 console.log(resp.data)
					 let token = data.token
					 //更新 storage 中的 token
					 uni.setStorageSync("token",token)
				 }
				 //执行传进的匿名函数，用作其他处理
				 fun(resp)
			 } else {  // 500 的错误代码, 弹出面包屑提示
				  uni.showToast({
				  	icon:'none',
					title:resp.data
				  });
			 }
		}
	})
}

