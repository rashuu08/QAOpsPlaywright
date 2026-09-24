class DashboardPage
{
    constructor (page)
    {
        this.page=page;
        this.products = page.locator(".card-body");
        this.productsText =page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
        this.orders=page.locator("button[routerlink*='myorders']");

    }
    async searchProductAddCart(productName)
    {

        const  titles = await this.productsText.allTextContents();//to get the title of a product
        console.log(titles);

        //to get the product count on the page and click on add to cart button for the product name ZARA COAT 3
        const count = await this.products.count(); //to get the product count on the page
        for(let i=0; i<count; ++i)
        
        if(await this.products.nth(i).locator("b").textContent()  === productName)   //if product name is same as the product name in the list then click on add to cart
        {
            //add to cart
            await this.products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    async navigateToCart()
    {
        await this.cart.click();
    }
    async navigateToOrders() 
    {
        await this.orders.click();
    }
}

module.exports={DashboardPage};