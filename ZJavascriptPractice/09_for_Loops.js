//program to add first n natural numbers using for loop
//1)For Loop
let sum = 0;
let n = 10;
for (let i = 0 ; i<n ; i++)
{
    sum += (i + 1);
    console.log
}
console.log("The sum of first " + n + " natural numbers is: " + sum);



let obj = 
{
    student1 :90,
    student2 : 80,
    student3 : 70,
    student4 : 60
}
//2)for In Loop
for(let a in obj)
{
    console.log("marks of " + a + ": " + obj[a]);
}

//3)for Of Loop
for(let b of "student1")
{
    console.log(b);
}