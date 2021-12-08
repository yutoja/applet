const list = []
function setlist(params) {
   let a =  list.some(value=>value.id==params.id)
   if(a) return
   list.push(params)
   store()
  }
function delectlist(id) {
    let a =  list.findIndex(value=>value.id==id)
    if(a==-1) return
    list.splice(a,1)
    store()
   }
   function getlist(id) {
    let a =  list.find(value=>value.id==id)
    if(a) return
    return a
   }
   function clear() {
    list = []
   store()
   }
   function store(){
    wx.setStorageSync("listdata", list)
   }
export default {
  setlist,
  delectlist,
  getlist,
  clear,
  list
}