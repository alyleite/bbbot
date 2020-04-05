const { xpaths, config } = require("./config");


const scrollToTop = async (page) => {
  await page.evaluate(_ => {
    window.scrollBy(0, -10000);
  });
};

const clickXPath = async (page, xpath) => {
  try {
    let handler = await page.$x(xpath);
    setTimeout(() => {
      handler[0].click();
    }, config.waitClick);
  } catch{ }
};

const clickOnElement = async (page, elem, x = null, y = null) => {
  const rect = await page.evaluate(el => {
    const { top, left, width, height } = el.getBoundingClientRect();
    return { top, left, width, height };
  }, elem);

  // // Use given position or default to center
  const _x = x ? x : rect.width / 2;
  const _y = y ? y : rect.height / 2;

  await page.mouse.click(rect.left + _x, rect.top + _y);
};


const removeSponsor = async (page) => {
  await page.evaluate((_) => {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML =
      '.tag-manager-publicidade-container { display: none; !important}';
    document.getElementsByTagName('head')[0].appendChild(style);
  });
};

const getTextFromSelector = (page) => async (selector) => {
  const element = await page.waitFor(selector);
  return await page.evaluate((element) => element.innerText, element);
}

const checkExists = (page) => async (selector) => {
  try {
    const t = await page.$(selector, { timeout: 2000 })
    return t != null;
  } catch (error) {
    return false;
  }
}

const checkVisible = (page) => async (selector) => {
  try {
    await page.waitForSelector(selector, {
      visible: true,
      timeout: 2000
    })
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  clickOnElement,
  getTextFromSelector,
  scrollToTop,
  removeSponsor,
  checkExists,
  clickXPath,
  checkVisible,
}
