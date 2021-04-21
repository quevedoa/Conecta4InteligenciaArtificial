const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use('/', express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

var profundidad
app.get('/setProfundidad', (req, res) => {
    // profundidad = parseInt(req.query.prof)
    console.log(req.query.prof)
    profundidad = parseInt(req.query.prof)
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/grid', (req, res) => {
    matrizJuego = String(req.query.lastMove)
    
    console.log(matrizJuego)

    const p = new Promise(function executor(resolve, reject){
        //escribirlo en un txts
        
        var posicion = `(setq tablero ${matrizJuego})\n (setq rtrn (abp B ${profundidad} 0 minf inf tablero 1))\n (setq rtrn (list "heuristica:" (first rtrn) "columna:" (second rtrn)))\n (with-open-file (str "./lisp/resp.txt" \n         :direction :output \n         :if-exists :supersede \n         :if-does-not-exist :create) \n(format str (tostr rtrn)) \n)`
        console.log(`Profundidad: ${profundidad}`)
        
        try {
            const data = fs.writeFileSync('./lisp/query.txt', posicion, { flag: 'w+' })
            //file written successfully
            resolve("OK");
        } catch (err) {
            console.error(err)
            reject("Error");
        }
    });

    p.then( function(value) {
        const {exec} = require("child_process");
        exec("clisp ./lisp/scriptC4.txt", (error, stdout, stderr) => {
            if (error) { 
                console.log(`error: ${error.message}`);
                return;
            } 
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            fs.readFile('./lisp/resp.txt', 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                arrPos = data[data.length-2];
                console.log(`Posicion Respuesta: ${arrPos}`);
                res.send(arrPos);
            });
            console.log(`stdout: lisp ejecutado`);
        });
    }, function(error) {console.log("error then1")}).then(function(value) {
        // fs.readFile('./lisp/resp.txt', 'utf8', function (err, data) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     arrPos = data[data.length-2];
        //     console.log(`Posicion Respuesta: ${arrPos}`);
        //     res.send(arrPos);
        // });
    }, 1000);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
