
//1) If statement
let a=5

if(a>0){
    console.log("This is a valid age")
}
console.log(typeof a)

//2) If else statement

let x=-50
if(x>0){
    console.log("This is a valid age")
}
else{
    console.log("This is an invalid age")
}

//3)if else if statement
let y=190
if(y<0)
{
    console.log("This is an invalid age")
}
else if(y>150)
{
    console.log("This is an unrealistic age")
}
else
{
    console.log("This is a valid age")
}


//5)ternary operator
let age = 20;
let result = (age>=18) ? "You are eligible to vote" : "You are not eligible to vote";
console.log(result)