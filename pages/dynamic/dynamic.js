import re from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    home:null,
    pinglu:null,
    height:0,
    tab:['.jing','.cazbody']

  },

  // tab点击时赋值
  chang(e) {
    let a = e.detail.current
    this.setData({
      index: a
    })
    switch (a) {
      case 1:
        if(this.data.dotai) return
        let value = wx.getStorageSync('co')
        re(`/user/event?uid=1&cookie=${value}`).then(value => {
          let u = value.events.map(value => {
            value.json = JSON.parse(value.json)
            return value
          })
          this.setData({
            dotai: u
          })
          this.fun()
        })
        break;
    }
  },
  // tab切换时赋值
  qie(e) {
    this.setData({
      index: e.currentTarget.id
    })
    this.fun()
  },
    // 设置tab高度
    fun() {
      //创建节点选择器
      var query = wx.createSelectorQuery();
      //选择id
      var that =  this;
      let cal = that.data.tab[that.data.index]
      query.select(cal).boundingClientRect(
        function (rect) {
          if(!rect) return
          that.setData({
            height: rect.height*2 +'rpx'
          })
        }).exec();
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
     // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
     eventChannel.on('acceptDataFromOpenerPage', data=> {
      this.setData({
        home:data
      })
       re(`/comment/event?threadId=${data.info.commentThread.id}`).then(value=>{
          this.setData({
            pinglu:value
          })
          this.fun()
       })
    })
   
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