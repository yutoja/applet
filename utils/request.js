import http from './http'

export default (url,data={},method='GET')=>{
 return new Promise((resolve,reject)=>{
  wx.request({
    url:http+url,
    data,
    method,
    success:request=>{
   const {data} =  request

   resolve(data)
    },
    fail:err=>{
   reject(err)
    }
  })
})
}

