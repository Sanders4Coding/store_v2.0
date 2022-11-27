const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{}
  },
  // 立即购买
  add_order(){
    let that = this
    let product = that.data.product
    let books = []

    let b = {
      product_id:product.id,
      product_img:product.img[0],
      product_name:product.name,
      product_price:product.price,
      product_num:1
    }
    books.push(b)
    wx.setStorage({
      key:'books',
      data:books
    })
    wx.navigateTo({
      url: '../add_order/add_order',
    })
  },
  // 加购物车
  add_shopping_car(){
    let that = this
    let product = that.data.product
    wx.showLoading({
      title: '添加中',
    })
    //禁止重复加购
    db.collection('shopping_car').where({
      product_id:product._id
    }).get().then(res=>{
      if(res.data.length>0){
        wx.hideLoading()
        wx.showModal({
          title: '温馨提示',
          content: '这本书已经在你的购物车里了！',
        })
      }else{
        //加购
        db.collection('shopping_car').add({
          data:{
            product_id:product._id,
            product_img:product.img[0],
            product_name:product.name,
            product_price:product.price,
            //数量默认1
            product_num:1,
            time:db.serverDate()
          }
        }).then(res=>{
          wx.hideLoading()
          wx.showToast({
            title: '添加成功',
            icon:'success'
          })
          console.log('加购物车',res);
        })
      }
    })
  },
  get_product(id){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    db.collection('product').doc(id).get().then(res=>{
      wx.hideLoading()
      console.log('获取书籍详情成功',res);
      that.setData({
        product:res.data
      })
    }).catch(err=>{
      wx.hideLoading()
      wx.showToast({
        title: '获取失败',
        icon: 'error'
      })
      console.log('获取书籍异常',err);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.get_product(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})