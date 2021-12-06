// components/dan/dan.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      // 歌单介绍
    gename: {
      type: String,
      value: '每一天'
    },
        // 歌单图片
        geimg: {
          type: String,
          value: '/static/images/123.jpg'
        },
    gequantity: {
          // 歌量
      type: Number,
      value: 0
    },
        // 歌单创建者
        createor: {
          type: String,
          value: '每一天'
        },

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

  }
})
