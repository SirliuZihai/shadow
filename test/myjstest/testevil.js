function myevil (fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}
let s = 'test1+\
        test2'
let arrays = ['wo','shi','hui']
//console.log(getIndexOfArray('i',arrays))
function getIndexOfArray (findStr,myArray) {
  for(let i=0;i<myArray.length;i++){
    if(myArray[i].indexOf(findStr)>-1){
      return i
    }
  }
  return -1
}

let str = 'woshihui'
let key = 'shi'
function highlight(key,str){
  if(str.indexOf(key)>-1){
    return str.substring(0,str.indexOf(key))+'<span style="background-color: #ffeb3b">'+key+'</span>'+str.substring(str.indexOf(key)+key.length)
  }else{
    return str
  }
}
console.log(typeof str)
console.log(typeof y)
console.log(typeof arrays === 'object')
console.log(arrays.constructor == Array)
let arrays1 = [{tag:[12.3,23]},{tag:[12.4,5]}]
console.log(arrays1[0].tag[1])  //23

let arrays2 = JSON.parse(JSON.stringify(arrays1)); //23 正确
//const arrays2 = [...arrays1]; //24 error errors 不包含数组里的对象
//let arrays2 = arrays1 // 24 error
//Object.assign(arrays2, arrays1) //24  errors 不包含数组里的对象
arrays2[0].tag[1] = 24
console.log(arrays1[0].tag[1])
console.log(arrays2[0].tag[1])
//let obj = arrays2[0]
arrays2[0].money = 0
//obj.money =0
//console.log(obj.money)
console.log(arrays2[0].money)
