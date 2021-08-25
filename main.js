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
	//查询用户摘要信息
	searchUserSummary: baseUrl + "/user/searchUserSummary",
	//查询月考勤记录
	searchMonthCheckin:baseUrl+"/checkin/searchMonthCheckin",
	//轮序请求新消息
	refreshMessage: baseUrl + "/message/refreshMessage",
	//分页查询消息列表
	searchMessageByPage: baseUrl + "/message/searchMessageByPage",
	
	//根据 ID 查询消息记录
	searchMessageById: baseUrl + "/message/searchMessageById",
	//设置消息状态为已读
	updateUnreadMessage: baseUrl + "/message/updateUnreadMessage",
	//删除消息
	deleteMessageRefById: baseUrl + "/message/deleteMessageRefById",
	
		// searchMyMeetingListByPage: baseUrl + "/meeting/searchMyMeetingListByPage",
		// searchUserGroupByDept: baseUrl + "/user/searchUserGroupByDept",
		// searchMembers: baseUrl + "/user/searchMembers",
		// insertMeeting: baseUrl + "/meeting/insertMeeting",
		// searchMeetingById: baseUrl + "/meeting/searchMeetingById",
		// updateMeetingInfo: baseUrl + "/meeting/updateMeetingInfo",
		// deleteMeetingById: baseUrl + "/meeting/deleteMeetingById",
		// searchUserTaskListByPage: workflow + "/workflow/searchUserTaskListByPage",
		// approvalMeeting: workflow + "/workflow/approvalMeeting",
		// selectUserPhotoAndName: baseUrl + "/user/selectUserPhotoAndName",
		// genUserSig: baseUrl + "/user/genUserSig",
		// searchRoomIdByUUID: baseUrl + "/meeting/searchRoomIdByUUID",
		// searchUserMeetingInMonth: baseUrl + "/meeting/searchUserMeetingInMonth",
		// searchRoleOwnPermission: baseUrl + "/role/searchRoleOwnPermission",
		// searchAllPermission:baseUrl+"/role/searchAllPermission",
		// insertRole: baseUrl + "/role/insertRole",
		// updateRolePermissions: baseUrl + "/role/updateRolePermissions",
		// searchAllRole:baseUrl+"/role/searchAllRole",
		// deleteRoleById:baseUrl+"/role/deleteRoleById",
		// searchAllDept: baseUrl + "/dept/searchAllDept",
		// insertDept: baseUrl + "/dept/insertDept",
		// deleteDeptById: baseUrl + "/dept/deleteDeptById",
		// updateDeptById: baseUrl + "/dept/updateDeptById",
		// insertUser: baseUrl + "/user/insertUser",
		// searchUserInfo: baseUrl + "/user/searchUserInfo",
		// searchUserSelfInfo: baseUrl + "/user/searchUserSelfInfo",
		// updateUserInfo: baseUrl + "/user/updateUserInfo",
		// deleteUserById: baseUrl + "/user/deleteUserById"
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
	console.log(uni.getStorageSync('token'));
	uni.request({ 
		"url":url,  //请求 URL
		"method":method,  //请求方法
		"header":{  //从 localStorage 中获得 token，附在请求头中提交
			token:uni.getStorageSync('token')
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

