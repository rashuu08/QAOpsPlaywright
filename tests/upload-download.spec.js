//npm install exceljs --savedev
//npm init - to install
//read all the content of excel
const ExcelJs = require ('exceljs');
const {test , expect} = require('@playwright/test');

async function writeExcelTest(searchText ,replacedText ,change,filePath)
{
    const workbook = new ExcelJs.Workbook();  //object created from Exceljs class
    await workbook.xlsx.readFile(filePath)//path for excel 
    const worksheet = workbook.getWorksheet('Sheet1');  //get sheet1 from workbook
    const output = await readExcel(worksheet , searchText );

    //to change the content on excel file
    const cell = worksheet.getCell(output.row , output.column+change.colChange);
    cell.value = replacedText;
    await workbook.xlsx.writeFile(filePath);
}

async  function readExcel(worksheet , searchText)
{
    let output={row:-1 , column : -1}
    worksheet.eachRow((row , rowNumber) =>
    { 
        row.eachCell((cell , colNumber)=>
        {
           // console.log(cell.value);
            if(cell.value === searchText)
            {
              //  console.log(rowNumber); //get the rowNumber whose  value is apple
               // console.log(colNumber); //get the column number  whose  value is apple
               output.row=rowNumber;
               output.column=colNumber;
            }
        })
    })
    return output;
}

//update mango price to 350
//writeExcelTest("Mango" ,350 ,{rowChange:0 , colChange:2} ,"C:/Users/rashmi.gupta/Downloads/exceldownloadtest.xlsx");
test('Upload Dwonload excel validation' , async({page})=>
{
    const textSearch = "Mango";
    const updateValue= '350';
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    const downloadPromise = page.waitForEvent('download'); //wait until the download complete
    await page.getByRole('button' , {name : 'Download'}).click();

    const download = await downloadPromise; //Get downloaded file
    await download.saveAs("C:/Users/rashmi.gupta/Downloads/download.xlsx"); //Save the downloaded file
    writeExcelTest(textSearch ,updateValue ,{rowChange:0 , colChange:2} ,"C:/Users/rashmi.gupta/Downloads/download.xlsx");
    await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles("C:/Users/rashmi.gupta/Downloads/download.xlsx");

    const textLocator =page.getByText(textSearch);
    const desiredRow =await page.getByRole('row').filter({has : textLocator});
    await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateValue);
})