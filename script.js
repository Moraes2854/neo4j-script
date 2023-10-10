require('dotenv').config();
const { initDriver } = require('./db/initDriver');
const AmountDataService = require('./services/amountData.service');
const names = require('./data/names');

async function main(){
    console.log(names.length);
    const driver = await initDriver(
        process.env.NEO4J_URI,
        process.env.NEO4J_USERNAME,
        process.env.NEO4J_PASSWORD
    );
    const amountDataService = new AmountDataService(driver);
    try {
        await amountDataService.getAllDataByColor('BORDO');
        return;
    } catch (error) {
        console.log(error);
    }
}

main();