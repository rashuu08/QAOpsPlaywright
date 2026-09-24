const {LoginPage}=require('./loginPage');
const {DashboardPage}=require('./DashboardPage');
const{OrdersHistoryPage} =require('./OrdersHistorypage');
const {OrdersReviewPage}=require('./OrdersReviewPage');
const{CartPage}=require('./CartPage');

class POManager
{
    constructor(page)
    {   this.page=page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.ordersHistorypage=new OrdersHistoryPage(this.page);
        this.ordersReviewPage= new OrdersReviewPage(this.page);
        this.cartPage=new CartPage(this.page);
    }

    getLoginPage()
    {
        return this.loginPage;
    }
    getDashboardPage()
    {
        return this.dashboardPage;
    }
    getCartPage()
    {
        return this.cartPage;
    }
    getOrdersHistoryPage()
    {
        return this.ordersHistorypage;
    }
    getOrdersReviewPage()
    {
        return this.ordersReviewPage;
    }
}

module.exports={POManager};