const muaic = {
  isplay:false,
  musicid:0,
  song:null
} 
let a = null
Object.defineProperty(muaic,'song',{
  get(){
  return a
  },
  set(value){
   a = value
   wx.setStorageSync("song", value)
  }
})
App({
  muaic
  ,
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
