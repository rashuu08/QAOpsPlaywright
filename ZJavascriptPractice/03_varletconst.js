console.log("JS var , let and const")

var a= 45;
var a ="p"
let b = "rashmi";
const author= "rashmi"
//let author = 5 //throws an error bcz constant cannot be changed
var c= null 
let d= undefined 

{
    let b='this'
    console.log=(b) //this will print 'this' because b is defined in this block
}
//console.log(b) //this will print 'rashmi' because b is defined in the global scope