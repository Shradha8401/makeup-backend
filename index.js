const http =require('http');
const path = require('path');
const fs = require('fs');
const {MongoClient}=require('mongodb');


async function findSomeData(client){
    const cursor = client.db("makeupDb").collection("products").find({});
    const results = await cursor.toArray();
    //console.log(results);
    
    fs.writeFile('./public/db.json',JSON.stringify(results),(err)=>{
        console.log(err);
    })
    console.log("Modified data in json");
}
async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri="mongodb+srv://shraddha:shrestha@project.i97dwyy.mongodb.net/test"
 

    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("yay connection established!")
        await findSomeData(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("connection closed!")
    }
}






const server = http.createServer((req, res)=>{
    
    console.log(req.url);
    // / or /api /about.html
     
    if( req.url ==='/'){
     
        fs.readFile(path.join(__dirname,'public','index.html'),
        (err, content)=>{

            if (err) throw err;
            res.writeHead(200,{ 'Content-type': 'text/html'});
            res.end(content);

        });
     }
     else if(req.url.match('\.css$')){
        const cssPath = path.join(__dirname,'public',req.url);
        const filesystem = fs.createReadStream(cssPath,'utf-8');
        res.writeHead(200,{'Content-Type': 'text/css'});
        filesystem.pipe(res);
        // console.log(cssPath);
     }else if(req.url.match('\.png$')){
        const pngPath = path.join(__dirname,'public',req.url);
        const filesystem = fs.createReadStream(pngPath);
        res.writeHead(200,{'Content-Type': 'image/png'});
        filesystem.pipe(res);
        // console.log(cssPath);
     }else if(req.url.match('\.jpg$')){
        const jpgPath = path.join(__dirname,'public',req.url);
        const filesystem = fs.createReadStream(jpgPath);
        res.writeHead(200,{'Content-Type': 'image/jpg'});
        filesystem.pipe(res);
        // console.log(cssPath);
     }
    else if(req.url ==='/api'){
        main();       
        fs.readFile(path.join(__dirname,'public','db.json'),
        (err, content)=>{
            if(err ) throw err;
            res.setHeader("Access-Control-Allow-Origin","*");
            res.writeHead(200, { 'Content-type': 'application/json'})
            res.end(content)
        });
    }else{
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("404 - Page not Found.");
    }
    }
);

server.listen(5959, ()=> console.log(" great our server is runnning"));