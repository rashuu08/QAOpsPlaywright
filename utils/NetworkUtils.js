//getToken() handles authentication, while createOrder() uses that token to create an order and returns the order ID.
//Login → get token → create order using that token → return order ID

class ApiUtils
{
    constructor(apiContext ,loginPayLoad) // to receive nd store the API context and login payload so other methods can reuse them
    {
        this.apiContext = apiContext;  //this refres to current class
        this .loginPayLoad=loginPayLoad;
    }
    async getToken()  //login and get token
    {
         const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login" ,
            {
                data:this.loginPayLoad  //request body
            })//200,201
           // expect(loginResponse.ok()).toBeTruthy();  //set the status success
            const loginResponseJson =  await loginResponse.json();//convert reponse into json
            const  token = loginResponseJson.token; //to extract token from the response
            console.log(token); //print token
            return token;  //it sends the token back  to whoever called
    }

    async createOrder(orderPayload)//create an order using the token
    {
         let  response ={};  //create empty js object
         response.token =await this.getToken(); //get the token
         const orderResponse =await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
                {
                    data: orderPayload, //request body
                    headers :
                    {
                        'Authorization': response.token , //authorized token
                        'Content-Type':'application/json'  // data sending in json format
                    }
                }) 
                const orderResponsejson = await orderResponse.json() //convert response into json
                console.log(orderResponsejson); //print into console
                const orderId = orderResponsejson.orders[0]; //get/extract  the first order id 
                response.orderId = orderId;  //store the response ID in response Object
                return response;  //returns  the complete object so another test calls it receive token and order ID
    }
}

module.exports={ApiUtils}; //this class can globally visible in all other files in project 
//This makes the ApiUtils class available to other JavaScript files.