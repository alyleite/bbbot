const puppeteer = require('puppeteer');
const {
  config,
  links,
  credentials,
  xpaths,
} = require("./config");
const { installMouseHelper } = require("./mouseHelper");
const fs = require("fs");
const {
  clickOnElement,
  getTextFromSelector,
  scrollToTop,
  removeSponsor,
  clickXPath,
  checkExists,
} = require('./utils.js');
const childProcess = require('child_process');


const login = async (page, email, password) => {
  page.goto(links.globoLoginURL, {
    waitUntil: "networkidle2"
  });

  await page.waitForSelector('#login');
  await page.waitFor(1000);

  await page.type('#login', email);
  await page.type('#password', password);

  await page.click('[class="button ng-scope"]');
  await page.waitFor(1000);
  console.log('Logged in.');
}


const goToVotePage = async (page) => {
  await page.goto(links.voteURL, {
    waitUntil: "networkidle2"
  });
  await removeSponsor(page);
  voteParticipant(page);
}


const reloadCaptcha = async (page) => {
  console.log('Reload Captcha.');
  if (await checkExists(page)(xpaths.reloadCaptcha)) {
    await page.click(xpaths.reloadCaptcha)
  }
}


const voteParticipant = async (page, vote = false) => {
  scrollToTop(page);
  await page.waitForXPath(xpaths.userDiv).then(async () => {
    await clickXPath(page, xpaths.userDiv);
  });

  if (vote) {
    await votar(page);
  }
}

let voteCounter = 0;

const handleCaptcha = (page) => async (response) => {
  const hookUrl = response.url();
  const statusCode = response.status();
  const request = response.request();

  if (hookUrl.startsWith(links.challengeAcceptedURL) &&
    parseInt(statusCode) === 200 &&
    request.method() === "POST"
  ) {
    voteCounter++;
    console.log("Votos computados: " + voteCounter);
    await page.waitFor(1000);
    goToVotePage(page);
    return;
  }

  if (hookUrl.startsWith(links.captchaURL)) {
    const res = await response.json();
    const { symbol: nameImage, image } = res.data;
    const icon = nameImage.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
    console.log('Download captcha from URL:', icon);
    fs.writeFile(`./src/images/${icon}.png`, image, "base64", (err) => { });

    await votar(page, icon);
  }
}

const votar = async (page, iconText) => {
  await page.waitFor(config.waitClick);
  if (!iconText) {
    const nameText = await getTextFromSelector(page)(xpaths.captchaTextClassName);
    iconText = nameText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
  }
  //console.log(iconText);
  try {
    const position = String(childProcess.execSync(`python ./src/compare_images.py "${iconText}"`)).trim();
    if (position === "None") {
      reloadCaptcha(page)
      await page.waitFor(config.waitClick);
      return;
    }
    const captchaElem = await page.$(xpaths.captcha);

    console.log(`Get captcha: ${iconText} | Position: ${position}`);
    const x = config.captchaIndividualSize * position + config.captchaCenter;
    //await page.waitFor(config.waitClick);
    await clickOnElement(page, captchaElem, x, config.captchaCenter);
    //await page.waitFor(config.waitClick);
  } catch (error) {
    goToVotePage(page);
    return;
  }

  try {
    //await page.waitFor(1000);
    const element = await page.$(xpaths.captchaErrorMsg);
    if (element) {
      const captchaError = await page.evaluate((element) => element.innerHTML, element);

      if (!captchaError) {
        const nameText2 = await getTextFromSelector(page)(xpaths.captchaTextClassName);
        const iconText2 = nameText2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
        if (iconText2 && iconText !== iconText2) {
          return;
        }
      } else {
        console.log('Captcha Response:', captchaError);
        //await page.waitFor(2000);
        //reloadCaptcha();
      }
    }
  } catch  {
  }

};

const init = async (email, password) => {
  if (!login || !password) {
    console.log('You need to export the env variables with your username and password.')
    process.exit()
  }

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=700,800"],
    headless: false,
  });

  const page = await browser.newPage();
  await installMouseHelper(page);
  await login(page, email, password);
  await goToVotePage(page);

  page.on("response", handleCaptcha(page));
};



(async () => {
  init(credentials.username, credentials.password);
})();