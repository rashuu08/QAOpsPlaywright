//nn bb ss u  -> null , number  , boolean , bigint , string , symbol , undefined -    PRIMITIVE DATATYPES
let a = null;
let b = 345;
let c = true; //can also be false
let d = BigInt("567") + BigInt("3");
let e = "Rashmi";
let f = Symbol("I am a nice symbol");
let g
console.log(a, b, c, d, e, f, g);
console.log(typeof a, typeof b, typeof c, typeof d, typeof e, typeof f, typeof g);



//Objects  - NON PRIMITIVE DATATYPE 

const item = {
    "a1": true,
    "a2": false,
    "a3": 67,
    "a4": undefined
}
console.log(item["a1"]);
console.log(item["a2"]);
console.log(item["a3"]);
console.log(item["a4"]);