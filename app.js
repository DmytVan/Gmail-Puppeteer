const NYTimes = require('./src/NYTimes');
const puppeteer = require('puppeteer');
const GmailPuppeteerHandler = require('./src/GmailPuppeteerHandler');
const {email, password, NYApiKey} = require('./src/data');



(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const gmailPuppeteer = new GmailPuppeteerHandler(page);
    console.log(await gmailPuppeteer.authorization(email, password));
    const id = String(+new Date());
    const messageText = await getMessage();
    console.log(await gmailPuppeteer.sendMessage(email, id, messageText));
    const messageInfo = await gmailPuppeteer.getMessageById(id);
    console.log(messageText === messageInfo.message ? 'All good' : 'Something went wrong. Run the test.');
})();

async function getMessage() {
    const nytimes = new NYTimes(NYApiKey);
    return nytimes.getHeaders(await nytimes.getMostPopular()).join('\n');
}










