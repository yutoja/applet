import re from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placheolderContent: "",
    hotList: [],
    searchConent: "",
    searchList: [],
    historyList: [],
    itden: 0,
    dats: {},
    heigth: 0,
    soud:'',
    kaihgu:true
  },
  kauh(){
    this.setData({
      kaihgu:!this.data.kaihgu
    })
  },
sou(e){
  let bu = e.currentTarget.dataset.value? e.currentTarget.dataset.value:this.data.searchConent
  this.setData({
    soud:bu,
    searchConent:bu,
    kaihgu:false
  })
  this.getdata(bu, '1', 0)
 
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化数据
    this.getInitData()
    this.getSearchHistory()
  },
  // 获取初始化数据
  async getInitData() {
    let placheolderData = await re("/search/default")
    let hosLintData = await re("/search/hot/detail")
    this.setData({
      placheolderContent: placheolderData.data.showKeyword,
      hotList: hosLintData.data
    })
  },
  // 表单内容改变
  handInput(e) {
    this.setData({
      searchConent: e.detail.value.trim(),
      dats:{},
      itden:0,
      kaihgu:true
    })
    if (!e.detail.value.trim()) {
      this.setData({
        searchList: []
      })
      return
    }
    this.is()

  },
  is() {
    clearTimeout(this.isSend)
    let {
      searchConent,
      historyList
    } = this.data
    this.isSend = setTimeout(async () => {
      let searchListData = await re('/search', {
        keywords: searchConent,
        limit: 10
      })
      this.setData({
        searchList: searchListData.result.songs
      })

      // 将搜索记录添加到历史记录中
      if (historyList.includes(searchConent)) {
        historyList.splice(historyList.indexOf(searchConent), 1)
      }
      historyList.unshift(searchConent)
      wx.setStorageSync("searchHistory", historyList)
      this.getSearchHistory()
    }, 300)

  },
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },
  clearhis() {
    this.setData({
      searchConent: '',
      searchList: [],
      dats:{},
      itden:0,
      kaihgu:true
    })
    this.getSearchHistory()
  },
  clearstory() {
    wx.showModal({
      content: "是否删除",
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync("searchHistory", [])
          this.getSearchHistory()
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 切换类型
  tigg(e) {
    let i =e.currentTarget.id
    this.setData({
      itden: i
    })
    if(this.data.dats[i]) return
    this.getdata(this.data.soud, e.currentTarget.dataset.type, e.currentTarget.id)
  },
  async getdata(keywords, type, nav) {
    const {
      result
    } = await re('/search', {
      keywords,
      type
    })
    let toud = this.data.dats[nav]
    switch (type) {
      case '1':
        toud ? toud.push(...result.songs) : (this.data.dats[nav] = result.songs)
        break
      case "1000":
        toud ? toud.push(...result.result.playlists) : (this.data.dats[nav] = result.playlists)
        break
      case "1014":
        toud ? toud.push(...result.result.videos) : (this.data.dats[nav] = result.videos)
        break
    }
    this.setData({
      dats: this.data.dats
    })
    this.fun()
  },
  finsh() {
    this.fun()
  },
  // 设置tab高度
  fun() {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    let cal = '.body' + that.data.itden
    query.select(cal).boundingClientRect(
      function (rect) {
        if (rect.height) {
          that.setData({
            heigth: rect.height * 2 + 'rpx'
          })
        }

      }).exec();
  },
  skip(e) {
    switch (e.currentTarget.dataset.type) {
      case '1':
        let dt = e.currentTarget.dataset.dt;
        wx.navigateTo({
          url: `/pages/songDetall/songDetall?song=${e.currentTarget.id}&dt=${dt}`,
        })
        break
      case '1000':
        wx.navigateTo({
          url: `../xiangqi/xiangqi?id=${e.currentTarget.id}&type=playlist`,
        })
        break
      case '1014':
        console.log(e.currentTarget.id)
        wx.navigateTo({
          url: "/pages/vodiedata/vodiedata",
          success: res=> {
           // 通过eventChannel向被打开页面传送数据
           res.eventChannel.emit('vedio',{id:e.currentTarget.id,type:e.currentTarget.dataset.urlt})
         }
        })
        break
    }
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