let arrays = ['23.42','234.34']
arrays.push('20.66')
console.log(arrays)
console.log(arrays.indexOf("52") +' ' + arrays.indexOf('20.66'))
console.log(arrays[0]+arrays[1])
console.log(Number(arrays[0])+Number(arrays[1]))

console.log(Number(arrays[0]).constructor)
console.log(arrays.length = 0)
console.log(arrays)

let arg1 = []
arg1 = arg1.concat([{'name':'oi'},{'name':'oi2'}])
arg1 = arg1.concat([{'name':'o3'},{'name':'oi4'}])
console.log(('slice==='))
console.log(arg1.splice(1,1))
console.log(('arg1==='))
console.log(arg1)
