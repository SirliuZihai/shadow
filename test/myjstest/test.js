ObjectId = require('mongodb').ObjectID;
function timeToObjId( time ) {
  var t = new Date(time);
  t = t.getTime()/1000; // 转换成秒数
  return t.toString(16)+'0000000000000000'// 转换成16进制的字符串，再加补齐16个0}
}
var objIdTimeFrom = timeToObjId( '2015-08-01T10:42' )
var objIdTimeTo= timeToObjId( '2015-08-02T11:42' )
console.log(objIdTimeFrom)
console.log(objIdTimeTo)
var oId = ObjectId(objIdTimeFrom).getTimestamp()
var t2 = oId.getTimestamp()
console.log(t2)
console.log(new Date(t2))

// eslint-disable-next-line to
function oIdIsEqual (id1, id2) { return id1.counter === id2.counter && id1.timestamp === id2.timestamp && id1.machineIdentifier === id2.machineIdentifier && id1.processIdentifier === id2.processIdentifier }
