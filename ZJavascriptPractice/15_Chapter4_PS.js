
//Q1 - What it will print
console.log("har\"" .length) //4

 //Q2 - Explore the includes , startswith and endswith functions of a string 
const sentence = 'The quick brown fox jumps over the lazy dog.'
const word ='fox'
console.log(`The word "${word}" ${sentence.includes(word) ? 'is' : 'is not'} in the sentence `)
const str1 ="cats are the best!"
console.log(str1.startsWith('cats'))
console.log(str1.endsWith('best!'))

 //Q3 - a program to convert a string to lowercase
let a = "RASHMI"
console.log(a.toLowerCase());

 //Q4 - Extract the amount out of this string 

 let str2="Please give rs 1000"
 let amount =str2.slice("Please give rs".length)
 let amount1 =Number.parseInt(str2.slice(15))
 console.log(amount)
 console.log(amount1)

 //Q5 - Try to choose 4th character of a given string

 let friend ="Hina"
 friend[3]="R" //cannot change because strings are immutable
 console.log(friend)  