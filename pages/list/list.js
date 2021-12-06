import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
   jingxu:null,
   wang:null,
   guang:null,
   shan:null,
   xuanzh:0,
   color:["#f4e1e7","#e1ebea","#f3e1e1","#e3e7f0"],
   back:["#e13179","#4c8b82","#c5313d","#618bc7"]
  },
click(e){
  this.setData({
    xuanzh:e.currentTarget.id
  })
  let a =0
  switch(1*e.currentTarget.id){
    case 0:
      a = 200
    break;
    case 1:
      a =925
    break;
    case 2:
      a =1250
    break;
    case 3:
      a =1850
    break;
    // case 4:
    //   a =1850
    // break;
  }
  wx.pageScrollTo({
    scrollTop:a,
    duration: 300
  })
},
scroll(e){
  let b = e.target.offsetTop
  let a
  if(b<925){
   a=0
  }else if(b<1250){
    a =1
  }else if(b<1850){
    a =2
  }else if(b<2000){
    a =3
  }
  this.setData({
    xuanzh:a
  })
}
,
skip(e){
  console.log(e)
  wx.navigateTo({
    url: `../xiangqi/xiangqi?id=${e.currentTarget.id}&type=playlist`,
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let a = await request('/toplist/detail')
    let b = /说唱|民谣|电音/
    let c = /说唱|民谣|电音|ACG|摇滚|国电|DJ|古风|古典/
    let d = /日语|韩语|Bili|NRJ|top|欧美|日本|UK|俄语|越南/
    let e = /VIP|硬地|K歌|达人|热歌|Follow/
     this.setData({
       jingxu:a.list.slice(0,4),
       wang:a.list.filter(value=>b.test(value.name)),
       guang:a.list.filter(value=>c.test(value.name)),
       shan:a.list.filter(value=>d.test(value.name)),
       lun:a.list.filter(value=>e.test(value.name)),
       te:a.list.slice(4).filter(value=>!(b.test(value.name)||d.test(value.name)||c.test(value.name)))
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