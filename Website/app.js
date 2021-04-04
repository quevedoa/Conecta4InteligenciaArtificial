const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use('/', express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/grid', (req, res) => {
    var row = req.query.lastMove[0];
    var col = req.query.lastMove[2];
    
    console.log(req.query.lastMove);

    const p = new Promise(function executor(resolve, reject){
        //escribirlo en un txts
        
        var posicion = `${row},${col}`;

        try {
            const data = fs.writeFileSync('./lisp/posicion.txt', posicion, { flag: 'w+' })
            //file written successfully
            resolve("OK");
        } catch (err) {
            console.error(err)
            reject("Error");
        }
    });

    p.then( function(value) {
        const {exec} = require("child_process");
        // exec("clisp ./lisp/inicializa.lisp", (error, stdout, stderr) => {
        //     if (error) { 
        //         console.log(`error: ${error.message}`);
        //         return;
        //     } 
        //     if (stderr) {
        //         console.log(`stderr: ${stderr}`);
        //     }
        //     console.log(`stdout: lisp ejecutado`);
        // });
    }, function(error) {console.log("error then1")}).then(function(value) {
        fs.readFile('./lisp/posicion.txt', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            arrPos = data.trimEnd().split(',');
            console.log(`Posicion: ${arrPos}`);
            res.send(arrPos);
        });
    }, 1000);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
