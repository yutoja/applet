import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },
  handIuput(e) {
    this.setData({
      [e.target.id]: e.detail.value
    })
  },
  async subim() {
    let {password, phone } = this.data
    let t =  /^1[36|78|51]\d{9}$/
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return 
    } else if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    } else if (!t.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    let {cookie,profile,account,bindings,code,msg} = await request('/login/cellphone', {phone,password})
    if(code==200){
      wx.showToast({
        title: '登录成功',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      wx.setStorage({
        key:"co",
        data:cookie
      })
      wx.setStorage({
        key:"user",
        data:JSON.stringify({profile,account,bindings})
      })
    wx.switchTab({
      url:'/pages/user/user'
    })
    }else{
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})