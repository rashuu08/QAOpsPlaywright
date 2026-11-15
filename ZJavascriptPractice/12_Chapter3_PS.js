const prompt =require('prompt-sync')();  

//Q1 - a program to print the marks of a student  in an object using for in loop
let marks = { 
    student1 : 98,
    student2 : 70,      
    student3 : 7,
    student4: 4
}

for (let i=0; i<Object.keys(marks).length;i++)
{
    console.log("the marks of " +  Object.keys(marks)[i] + " are " + marks[Object.keys(marks)[i]])

}

//Q2 - program in Q1 using for in loop
for(let key in marks )
{
    console.log("the marks of "+ key + " are " + marks[key])
}

//Q3 - program to print "try again" until the user enters the correct number
let cn = 4;
let i 
while(i!=cn)
{
    i =Number(prompt("Enter a number :"))
    console.log("try again")
}
console.log("correct number")

//Q4 - a function to find mean of 5 numbers

const mean =(a , b , c ,d) =>
{
    return (a+b+c+d)/4
}
console.log(mean (4,5,6,7))