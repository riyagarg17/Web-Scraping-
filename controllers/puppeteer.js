const puppeteer = require("puppeteer");

let limit = 8;
async function scraperAmazon(productName) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    page.on("console", consoleObj => console.log(consoleObj.text()));
    await page.setViewport({ width: 1366, height: 768 });
    await page.setRequestInterception(true);

    page.on("request", req => {
      if (req.resourceType() == "stylesheet" || req.resourceType() == "font") {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto("https://amazon.in", { waitUntil: "load" });

    await page.waitFor("input[name=field-keywords]");

    await page.type("input[name=field-keywords]", productName);
    page.keyboard.press("Enter");

    await page.waitForSelector(".s-result-list.s-search-results.sg-row");
    let productCount = await page.$eval(
      `div.s-result-list.s-search-results.sg-row`,
      divs => divs.children.length
    );

    let searchResults = [];
    if (productCount >= limit) {
      for (i = 1; i <= limit; i++) {

            if(await page.$(
              `div.s-result-list.s-search-results.sg-row > div:nth-child(${i}) div.a-section.a-spacing-none.a-spacing-top-small span.a-price-whole`,
              divs => divs.textContent
            )==null){
              //console.log("skipping iteration:");
              //i++;
              limit++;
              continue;
            }
            else{
              
              
              let productName = await page.$eval(
                `div.s-result-list.s-search-results.sg-row > div:nth-child(${i}) div.a-section.a-spacing-none.a-spacing-top-small > h2 > a > span`,
                divs => divs.textContent
              );
  
              //console.log("amazon name:",productName);
              let productPrice = await page.$eval(
                `div.s-result-list.s-search-results.sg-row > div:nth-child(${i}) div.a-section.a-spacing-none.a-spacing-top-small span.a-price-whole`,
                divs => divs.textContent
              );
  
              //console.log("amazon price:",productPrice);
              let productImage = await page.$eval(
                `div.s-result-list.s-search-results.sg-row > div:nth-child(${i}) span > a > div > img`,
                divs => divs.src
              );
  
              //console.log("amazon image:",productImage);
  
              let path = await page.$eval(
                `div.s-result-list.s-search-results.sg-row > div:nth-child(${i}) div.a-section.a-spacing-none.a-spacing-top-small > h2 > a`,
                divs => divs.href
              );
  
              searchResults.push({ productName, productImage, productPrice, path });
            }
            
      }

      return searchResults;
    } else if (productCount < limit && productCount > 0) {
      for (i = 1; i <= productCount; i++) {
        let productName = await page.$eval(
          `div.s-result-list.s-search-results.sg-row > div:nth-child(${i}) div.a-section.a-spacing-none.a-spacing-top-small > h2 > a > span`,
          divs => divs.textContent
        );

        //console.log("amazon name:",productName);
        let productPrice = await page.$eval(
          `div.s-result-list.s-search-results.sg-row > div:nth-child(${i}) div.a-section.a-spacing-none.a-spacing-top-small span.a-price-whole`,
          divs => divs.textContent
        );

        //console.log("amazon price:",productPrice);
        let productImage = await page.$eval(
          `div.s-result-list.s-search-results.sg-row > div:nth-child(${i}) span > a > div > img`,
          divs => divs.src
        );

        //console.log("amazon image:",productImage);

        let path = await page.$eval(
          `div.s-result-list.s-search-results.sg-row > div:nth-child(${i}) div.a-section.a-spacing-none.a-spacing-top-small > h2 > a`,
          divs => divs.href
        );

        searchResults.push({ productName, productImage, productPrice, path });
      }

      return searchResults;
    } else {
      return { error: "no product found" };
    }
  } catch (e) {
    console.log("error", e);
  }
}

async function scraperFlipkart(productName) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    page.on("console", consoleObj => console.log(consoleObj.text()));
    await page.setViewport({ width: 1366, height: 768 });
    /*await page.setRequestInterception(true);

      page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' ){
            req.abort();
        }
        else {
            req.continue();
        }
    });*/

    await page.goto("https://www.flipkart.com/", { waitUntil: "load" });

    await page.waitFor(
      "body > div.mCRfo9 > div > div > div > div > div.Km0IJL.col.col-3-5 > div > form"
    );

    page.click("body > div.mCRfo9 > div > div > button");
    await page.waitFor("input[name=q]");

    page.click("input[name=q]");
    //await page.evaluate((selector) => document.querySelector(selector).click(), selector); 
    await page.type("input[name=q]", `${productName}`);
    //page.click("#container > div > div._3ybBIU > div._1tz-RS > div._3pNZKl > div.Y5-ZPI > form > div > button");
    await page.keyboard.press("Enter");
    let searchResults = [];

    let limit=8;
    await page.waitForSelector('#container > div > div.t-0M7P._2doH3V > div._3e7xtJ');
    //console.log("status:",await page.$( "#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div > div > img",divs => divs.src));
    if (
      (await page.$("#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div > div > img",
        divs => divs.src)) !== null
    ) {
      console.log("no product found:");
      return { error: "no product found" };
    } else {
      //console.log("products found");
      await page.waitForSelector(
        "#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2)"
      );
      /*let productCount = await page.$eval(
        "#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(2) > div",
        divs => divs.children.length
      );*/
      let productString=await page.$eval("#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div._1HmYoV.hCUpcT.col-12-12 > div > div > span",divs => divs.textContent);
      //console.log(productString);
      //console.log(productString.indexOf("1")+3);
      let productCount=productString.substring(productString.indexOf("1")+3,productString.indexOf("of")-1);
      //console.log("product count:",(productCount));
      productCount=parseInt(productCount);
     console.log("product count:",typeof(productCount));
      if (productCount >= limit) {
        let j=1,k=1;
        console.log("product count>4");
        for (i = 1; i <= limit; i++) {
          let productName = await page.$eval(
            `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(${2*j}) > div > div:nth-child(${k}) > div > a._2cLu-l`,
            divs => divs.textContent
          );

          console.log(`${i}`,productName);
          let productPrice = await page.$eval(
            `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(${2*j}) > div > div:nth-child(${k}) > div > a._1Vfi6u > div > div._1vC4OE`,
            divs => divs.textContent
          );
          console.log(`${i}`,productPrice);

          let productImage = await page.$eval(
            `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(${2*j}) > div > div:nth-child(${k}) > div > a.Zhf2z- > div:nth-child(1) > div > div > img`,
            divs => divs.src
          );
          console.log(`${i}`,productImage);
          let path = await page.$eval(
            `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(${2*j}) > div > div:nth-child(${k}) > div > a._2cLu-l`,
            divs => divs.href
          );
          console.log("value of k:",k);
          
          if(k%4==0){
            j++;
            
          }
          if(k%4==0){
            k=k%4;
          }
          k++;
         // console.log(`${i}`,path);

         //console.log("before push ");
          searchResults.push({ productName, productPrice, path, productImage });
          console.log("searchResults: ",searchResults.length);
        }
        console.log("flipkart:",searchResults);
        return (searchResults);
      } else if (productCount == 1) {
        console.log("only one product found");
        let productName = await page.$eval(
          "#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div > div:nth-child(2) > div:nth-child(2) > div > div > div > a._2cLu-l",
          divs => divs.textContent
        );

        let productPrice = await page.$eval(
          "#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div > div:nth-child(2) > div:nth-child(2) > div > div > div > a._1Vfi6u > div > div",
          divs => divs.textContent
        );

        let productImage = await page.$eval(
          `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div > div:nth-child(2) > div:nth-child(2) > div > div > div > a.Zhf2z- > div:nth-child(1) > div > div > img`,
          divs => divs.src
        );

        let path = await page.$eval(
          `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div > div:nth-child(2) > div:nth-child(2) > div > div > div > a._2cLu-l`,
          divs => divs.href
        );

        searchResults.push({ productName, productPrice, path, productImage });
        return searchResults;
      } else if (productCount < limit) {

        console.log("less than 4 products:");
        for (i = 1; i <= productCount; i++) {
          let productName = await page.$eval(
            `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(${i}) > div > a._2cLu-l`,
            divs => divs.textContent
          );

          let productPrice = await page.$eval(
            `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(${i}) > div > a._1Vfi6u > div > div._1vC4OE`,
            divs => divs.textContent
          );

          let productImage = await page.$eval(
            `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(${i}) > div > a.Zhf2z- > div:nth-child(1) > div > div > img`,
            divs => divs.src
          );

          let path = await page.$eval(
            `#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(${i}) > div > a._2cLu-l`,
            divs => divs.href
          );

          searchResults.push({ productName, productPrice, path, productImage });
        }

        return searchResults;
      }
    }
  } catch (e) {
    console.log("error");
  }
}

exports.scrapeAmazon = async (req, res, next) => {
  const amazonData = await scraperAmazon(req.params.name);
  req.amazon = amazonData;
  next();
};

exports.scrapeFlipkart =  async (req, res) => {
  let amazonData = req.amazon;
  const flipkartData = await scraperFlipkart(req.params.name);
  
  //console.log("flipkartData",flipkartData);
  res.json({ flipkartData, amazonData });
};
