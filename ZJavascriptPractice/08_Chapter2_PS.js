//Q1- logical operator to find whether the age of a person lies between 10 and 20
let age = 25;
if (age > 10 && age < 20) {
    console.log("The age is between 10 and 20");
}
else {
    console.log("The age is not between 10 and 20");
}

//Q2 - the use of switch case statements in js
let day = 8;
switch (day) 
{
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    case 3:
        console.log("Wednesday");
        break;
    case 4:
        console.log("Thursday");
        break;
    case 5:
        console.log("Friday");
        break;
    case 6:
        console.log("Saturday");
        break;
    case 7:
        console.log("Sunday");
        break;
    default:
        console.log("Invalid day");
}

//Q3 - js program to find whether a number is divisible by 2
let num = 8;
if (num % 2 == 0) {
    console.log("The number is divisible by 2");
}
else
{
    console.log("The number is not divisible by 2");
}

//Q4 - js program to find wtherher a number is divisible by 2 and 3
let number = 12;
if (number % 2 == 0 && number % 3 == 0) {
    console.log("The number is divisible by 2 and 3");
}
else
{
    console.log("The number is not divisible by 2 and 3");
}

//Q5 - print "You can drive" based on age beign greater than or equal to 18 using ternary operator
let test=25;
let ans=(test>=18) ? "You can drive" : "You cannot drive";
console.log(ans);
