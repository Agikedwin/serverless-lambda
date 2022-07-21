'use strict';

module.exports.agikFirstlambda = async (event) => {
const random = parseInt(Math.random() * 100);
console.log("this is random number generated ", random)
return random;
}
