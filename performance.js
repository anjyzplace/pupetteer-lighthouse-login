const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const auth = require('./utils/adfs-login');
const fs = require('fs');

puppeteer.launch({headless: false}).then(async browser => {
    const URL='';
    const username = '';
    const password = '';
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle0"});
  console.log('Page done');
  await auth.login(page, username, password);
  await page.waitFor(7000);

  const browserWSEndpoint = browser.wsEndpoint();
  browser.disconnect();

  // Use the endpoint to reestablish a connection
  const browser2 = await puppeteer.connect({browserWSEndpoint});

  let thePort= await getPort(browserWSEndpoint);
  await runLighthouse(URL, thePort);

async function runLighthouse(URL, thePort ) {
    const flags = {onlyCategories: ['performance']};
    return lighthouse(URL, { port: thePort, disableStorageReset: true, onlyCategories: ['performance']  }, null).then(results => {
        // Use results!
        const data = JSON.parse(results.report);
        console.log(data.categories.performance);
        let the_score = data.categories.performance.score;
        console.log(`The score is ${the_score}`);
        fs.writeFile("output.json", results.report, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
         
            console.log("JSON file has been saved.");
        });
        // console.log(results);
      });
  }

  async function getPort(string) {
    var re = /127.0.0.1:(.*)\/dev/;
    var ariyo = re.exec(string);
    // console.log(ariyo[1]);
    return ariyo[1];
  };
  // Close Chromium
  await browser2.close();
});