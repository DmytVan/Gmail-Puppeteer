const NYTimes = require('../src/NYTimes');
const puppeteer = require('puppeteer');
const assert = require('assert');
const GmailPuppeteerHandler = require('../src/GmailPuppeteerHandler');
const {email, password, NYApiKey} = require('../src/data');

jest.setTimeout(60000);
const id = String(+new Date());
let gmailPuppeteer;
let message;

test('authorization', async () => {
    const result = await (await getPuppeteer()).authorization(email, password);
    expect(result).toBe('https://mail.google.com/mail/u/0/#inbox');
});

test('sending message', async () => {
    const messageText = await getMessage();
    const result = await (await getPuppeteer()).sendMessage(email, id, messageText);
    expect(result).toBe('Письмо отправлено.');
});

test('check message', async () => {
    const messageInfo = await (await getPuppeteer()).getMessageById(id);
    expect(messageInfo.theme).toBe(id);
    expect(messageInfo.message).toBe(message);
});


// it('1', async function() {
//     console.log(result);
//     assert.equal(result, 'https://mail.google.com/mail/u/0/#inbox');
// })
//
// it('2', async function () {
//     const id = String(+new Date());
//     const messageText = await getMessage();
//     console.log(await getGmailPuppeteer.sendMessage(email, id, messageText));
//     const messageInfo = await getGmailPuppeteer.getMessageById(id);
//     console.log(messageText === messageInfo.message);
//     assert.equal(1,1);
// });
//
//
//
//
async function getPuppeteer() {
    if (gmailPuppeteer) return gmailPuppeteer;
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    gmailPuppeteer = new GmailPuppeteerHandler(page);
    return gmailPuppeteer;
}

async function getMessage() {
    if (message) return message;
    const nytimes = new NYTimes(NYApiKey);
    message = nytimes.getHeaders(await nytimes.getMostPopular()).join('\n');
    return message
}

