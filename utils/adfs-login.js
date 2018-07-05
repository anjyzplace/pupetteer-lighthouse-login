
exports.login = async (page, username, password) => {
    console.log('Inside login function');
    await page.waitForSelector('#userNameInput', { timeout: 40000 });
    await page.type('#userNameInput', username);
    await page.type('#passwordInput', password);
    const Button = await page.$('#submitButton');
    Button.click();
    await page.waitForSelector('#idSIButton9', { timeout: 40000 });
    const MicrosoftButton = await page.$('#idSIButton9');
    await Promise.all([
        page.click('#idSIButton9'),
        page.waitForNavigation()
      ]);
        return Date();
    };