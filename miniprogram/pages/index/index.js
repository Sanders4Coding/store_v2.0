const app = getApp()
const db = wx.cloud.database()
Page({
  data:{
    swiper:[],
    pro_list:[],
    search_list:[],
    search_case:false
  },
  // 展示搜索框
  search_case_show(){
    let that = this
    that.setData({
      search_case:true
    })
  },
  // 搜索事件，按下回车生效
  search(e){
    let that = this
    if(e.detail){
      wx.showLoading({
        title: '搜索中'
      })
      db.collection('product').where({
        isSale:true,
        name: db.RegExp({
          regexp: e.detail,
          options: 'i'
        })
      }).get().then(res=>{
        wx.hideLoading()
        that.setData({
          search_list:res.data
        })
        console.log('搜索结果',res);
      })
    }else{
      that.setData({
        search_list:[],
        search_case:false
      })
    } 
  },
  // onLoad函数页面加载成功时就执行
  onLoad:function(options){
    let that = this
    // 这里注释掉是因为不要每次保存刷新都要去数据库读取内容，不然很快就把流量干没了
    db.collection('swiper').get({
      success:res=>{
        console.log('轮播图获取成功',res)
        that.setData({
          swiper:res.data
        })
      },fail:err=>{
        console.log('轮播图获取失败',err);
      }
    })
    db.collection('product').where({
      isSale:true
    }).get({
      success:res=>{
        console.log('商品获取成功',res);
        that.setData({
          pro_list:res.data
        })
      },fail:err=>{
        console.log('商品获取失败',err);
      }
    })
  },
  onShow: function () {
    let that = this
    that.onLoad()
  },
  // 下拉刷新
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading()
    wx.reLaunch({
      url: '/pages/index/index',
      success:function(res){
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  }
  
})