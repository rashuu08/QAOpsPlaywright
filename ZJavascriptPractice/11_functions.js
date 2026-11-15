
function average(x,y)
{
    console.log("yo");
    return 1+ (x+y)/2;
}

//another way to write the same function using arrow function
const sum = (p,q) => 
{
    return p+q;
}

//another  way to write a function without using function name 
const hello =() => {
    console.log("Hello function");
    return "hi";
}
let a=1;
let b =2;
let c=3;

console.log("Average of a and b is: " + average(a,b));
console.log("Average of b and c is: " + average(b,c));
console.log("Average of a and c is: " + average(a,c));
console.log("Sum of a and b is: " + sum(a,b));

let v = hello();
{
    console.log(v);
}
