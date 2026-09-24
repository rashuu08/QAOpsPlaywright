const base =require('@playwright/test');


exports.customtest = base.test.extend
({
    testDataForOrder : 
    {
         "username" :"rashmi.gupta.iic.0116@gmail.com",
         "password":"Reyna08@",
         "productName": "ZARA COAT 3"
    }
})
