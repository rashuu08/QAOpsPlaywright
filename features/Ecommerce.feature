Feature:Ecommerce validations
    @Regression
    Scenario: Placing the order
        Given a login to Ecommerce application with "rashmi.gupta.iic.0116@gmail.com" and "Reyna08@"
        When Add "ZARA COAT 3" to Cart
        Then Verify "ZARA COAT 3" is displayed in the Cart
        When Enter valid details and Place the Order
        Then Verify order is present in the OrderHistory


    @Validation
    Scenario Outline: Placing the order
        Given a login to Ecommerce2 application with "<username>" and "<password>"
        Then Verify Error message is displayed



        Examples:
            | username                        | password |
            | rashmi.gupta.iic.0116@gmail.com | Reyna08@ |
            | reyna08@gmail.com               | Reyna08@ |

