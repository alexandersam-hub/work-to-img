const express = require("express");
const cors = require("cors");
const {v4: uuid} = require('uuid')
// const crypto = require('crypto');
const fs = require('fs');

const PORT = 8080;

const app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.post("/api/upload_avatar", (req, res) => {
    console.log(req.body);
    const randomString = uuid();
    const stream = fs.createWriteStream(`./public/images/${randomString}.png`);

    stream.on('finish', function () {
        console.log('file has been written');
        res.end('file has been written');
    });

    stream.write(Buffer.from(req.body), 'utf-8');
    stream.end();
});

app.get('/img/:id', (req, res)=>{
    console.log(req.params.id)
    fs.readFile('./public/images/'+req.params.id,(err, data)=>{
        if (err) console.log(err)
        res.setHeader("Content-Type", "image/jpeg");
        res.end(data)
    })
})
app.get('/img', (req, res)=>{
    res.send('hello')
})
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
