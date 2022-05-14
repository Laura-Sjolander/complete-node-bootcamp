const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');


//////////FILES ////////
//Blocking, synchronous way - dont do this!
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInput);

// const textOutput = `This is what we know about avocado: ${textInput}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOutput);
// console.log('File written');

//Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err => {
//                 console.log('your file has been created 😉');

//             })
//         });
// });
// });
// console.log('will read file');

///// SERVER //// 
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%COUNTRY%}/g, product.from);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;

}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
    const dataObj= JSON.parse(data);


const server = http.createServer((req, res) => {
    const pathName = req.url;

    //Overview page
    if(pathName === '/' ||  pathName == '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

      const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
      const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    //Product page
} else if (pathName === '/product') {
    res.end('no, this is the product');

    //API
} else if (pathName === '/api') {
    res.writeHead(200, {
        'Content-type': 'application/json'});
        res.end(data);

    //Not found 404
}else {
    res.writeHead(404, {
        'Content-type' : 'text/html', 
        'my-own-header' : 'this is my own header for 404'
    });
    res.end('<h1>Page not found- SORRY');
}
});

server.listen(8000, '127.0.0.1', () => {
    console.log('server is started, listening to request on port 8000');
});