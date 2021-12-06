import data from '../../utils/data'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      value:data.list,
      type:Array
    },
    music:{
      value:0,
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    songs:null,
    mu:0,
    id:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    skip(e){
      if(e.target.id==this.data.music){
        wx.showToast({
          title: '已在选中歌曲页面',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return
      }
      let dt = e.currentTarget.dataset.dt;
      wx.redirectTo({
        url: `/pages/songDetall/songDetall?song=${e.target.id}&dt=${dt}`,
      })
    },
    remov(e){
      this.triggerEvent('myremove',{id:e.target.id})
    }
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      this.setData({
        songs:data.list
      })
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  lifetimes: {
    created(){
  
    },
    ready: function() {
      // 在组件实例进入页面节点树时执行
      this.setData({
        songs:this.properties.list
      })
    },
    moved: function() {
      // 在组件实例被从页面节点树移除时执行
      console.log(1)
    }}
})
