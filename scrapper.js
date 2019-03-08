const puppeteer = require('puppeteer');

const USERNAME_SELECTOR =  '#usuario';
const PASSWORD_SELECTOR = '#password';
const BUTTON_SELECTOR = '#frmLogin > ul > li > input';

const buy = 'body > div.containerSite > div.container > div.right-column > div > div:nth-child(3) > a > div > div > div:nth-child(1)';
const sell = 'body > div.containerSite > div.container > div.right-column > div > div:nth-child(3) > a > div > div > div.currency-value__value.currency-value__value--right';
const buy_sell = 'body > div.containerSite > div.container > div.right-column > div > div:nth-child(3)';

const CREDS = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
};

module.exports = async () => {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.goto(process.env.ENDPOINT);

    await page.click(USERNAME_SELECTOR);

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await page.click(BUTTON_SELECTOR);

    await page.waitForNavigation();

    const frame = page.frames()[1];

    let compra = await frame.$eval(buy, e => e.innerText);
    compra = compra.replace(',','.');

    let venta = await frame.$eval(sell, e => e.innerText);
    venta = venta.replace(',','.');


    let cNumber = parseFloat(compra.split(' ')[1]);
    let vNumber = parseFloat(venta.split(' ')[1]);
    let aNumber = (cNumber + vNumber ) / 2;


    const avergare = `Promedio: ${aNumber}`;

    const elh = await frame.$( buy_sell );
    await elh.screenshot({ path: './cotizacion.png'});
    browser.close();

    return (
        `
${compra}
${venta}
${avergare}
        `
    )
};

