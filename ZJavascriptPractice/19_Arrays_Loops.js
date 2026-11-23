let num = [3,54,1,2,4]

for(let i =0; i<num.length;i++)
{
    console.log(num[i])
}

num.forEach((element)=>
{
    console.log(element * element)
})

//Array.from
let name = "rashmi"
let arr =Array.from(name)
console.log(arr)

//for...of
for(let item of num)
{
    console.log(item)
}

//for...in
for(let i in num)
{
    console.log(i)
}
