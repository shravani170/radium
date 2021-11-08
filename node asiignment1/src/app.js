const obj = require('./logger');
obj.log('my name is s');
obj.welcome();
console.log("link"+" " ,obj.url);
console.log("======================" );
const obj1 = require('./util1/helper');
obj1.getDate();
obj1.getMonth();
obj1.getInfo();
console.log("======================" );
const obj2= require('../validator/formater');
obj2.trim();
obj2.changeToLower();
obj2.changeToUpper();
console.log("======================" );
const obj3=require('lodash');
console.log(obj3.chunk(['jan','feb','mar','apr','may','jun','july','aug','sep','oct','nov','dec'],3));
console.log("======================" );
console.log(obj3.tail([1,3,5,7,9,11,13,15,17]));
console.log("======================" );
console.log(obj3.union([1,2,3],[2,1,4],[4,6,1],[4,8,9]));
console.log("======================" );
console.log(obj3.fromPairs([["horror","the shining"],["drama","retanic"],["fantasy","xyz"]]));






