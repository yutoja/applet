// components/kuai/kuai.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     name:{
       value:'wu',
       type:String
     },
     shu:{
      value:[],
      type:Array
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
      wx.navigateTo({
        url: `../xiangqi/xiangqi?id=${e.currentTarget.id}&type=playlist`,
      })
    },
  }
})
