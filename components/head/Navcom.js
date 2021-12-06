// components/Navcom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:'每一天'
    },
    nav:{
      type:String,
      value:'每一天'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    skip(e){
      switch(this.properties.title){
        case "推荐歌单":
            wx.navigateTo({
              url: `../../pages/destall/destall`,
            })
          break;
          case "排行榜":
            wx.navigateTo({
              url: `../../pages/list/list`,
            })
            break;
      }
    }
  }
})
