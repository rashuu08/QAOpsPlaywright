//Q1 - create an array of numbers and take input from the user to add numbers to this arrays

// let arr=[1,2,3,4,5,6,7,83]
// let a = 24
// arr.push(a)
// console.log(arr)

//Q2 =Keep adding numbers to the array in 1 untill 0 is added to the array
let arr=[1,2,3,4,5,6,7,83]
let a=8
do {
    a = 0
arr.push(a)
console.log(arr);
}while(a!=0)


//Q3 - filter for numbers divisibele by 10 from a given array
let divi= [10,22,3,40,5,6,7,83 , 670]
let n=divi.filter((x)=>{
    return x%10 == 0
})
console.log(n)

//Q4 -create an array of square of a given numbers 
let sq= [10,22,3,40,5,6,7,83 , 670]
let j=sq.map((x)=>{
    return x*x 
})
console.log(j)

//Q5 - use reduce to clculate factorial of a given number from an array of first n natural numbers 

let sq= [10,22,3,40,5,6,7,83 , 670]
let j=sq.map((x)=>{
    return x*x 
})
console.log(j)