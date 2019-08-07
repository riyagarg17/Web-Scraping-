const puppeteer = require('puppeteer');
const express=require('express');
const cors=require('cors');
const {scrapeAmazon,scrapeFlipkart}=require('./controllers/puppeteer');
const app=express();

app.use(cors());

app.get('/search/:name',scrapeAmazon,scrapeFlipkart);


  const port =5000;
  app.listen(port, () => {
    console.log('Server is running');
});