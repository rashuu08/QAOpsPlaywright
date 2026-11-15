//Chapter 1 - PS 
// Q1 variable of type string and try to add number to it
let a ="Rashmi"
let b = 7
console.log(a+b) //Rashmi7

// Q2 Use typeof operator to find the datatype of the variable in Q1
console.log(typeof(a+b))

//Q3 Create a  object in js  - try to change it letter  --> cannot store a new value in a constant object 
const a1 ={
    name :"Rashmi",
    section :1 ,
    isPrincipal : false
}
//a1=50

//Q4 Try to add a new key to the object created in Q3

a1['friend'] ="Zoya"
a1['name'] ="Test"
console.log(a1)

//Q5 Js program to create a word meaning dictionary of 5 words
const dictionary = {
    appreciate: "recognize the full worth of",
    word2: "meaning2",
    word3: "meaning3",
    word4: "meaning4",
    word5: "meaning5"
};
console.log(dictionary);