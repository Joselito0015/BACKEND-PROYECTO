/* ---------------------- Modulos ----------------------*/
const express = require('express');
const morgan = require('morgan');
const fs = require("fs");
const bodyParser = require('body-parser');

const routerProductos = express.Router();//Segmento de rutas
const routerCarrito = express.Router();//Segmento de rutas

/* ---------------------- Instancia de express ----------------------*/
const app = express();

/* ---------------------- Middlewares ---------------------- */
app.use(morgan('tiny'));        //Usamos el middleware th morgan
routerProductos.use(express.json());     //Parametrizamos el formato de comunicación para esa ruta
routerCarrito.use(express.json());     //Parametrizamos el formato de comunicación para esa ruta
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));     

/*---------------------   CONSTANTES  --------------------- */

const PATH_PRODUCTOS="./public/productos.json"
const PATH_CARRITO="./public/carrito.json"
const PATH_CONFIG="./public/config.json"

/*---------------------   FUNCIONES  --------------------- */

function  saveProducto(req, res,ruta){
    try{
        fs.readFile(ruta,'utf-8', (error, contenido)=>{
            if(error) {
                throw new Error(error);
            }else{
                let info=JSON.parse(contenido)
                const producto ={
                    id: nextIDproductos(),
                    timestamp: Date.now(),
                    nombre:req.body.nombre,
                    descripcion: req.body.descripcion,
                    codigo: req.body.codigo,
                    foto: req.body.url,
                    precio:req.body.precio,
                    stock: req.body.stock
                }

                info.push(producto);
                let OBJson = JSON.stringify(info,null,2);
                res.status(200).json({data: info});
                console.log(info)
                fs.writeFileSync(ruta,OBJson,"utf-8");
            }
        })}
    catch(error){
            console.error(error);
        }
}


function nextIDproductos(){
    let nextID
    try{
        let info=fs.readFileSync(PATH_CONFIG,'utf-8')
        info=JSON.parse(info)
        info.id_productos= info.id_productos +1;
        nextID=info.id_productos

        let OBJson = JSON.stringify(info,null,2);
        fs.writeFileSync(PATH_CONFIG,OBJson,"utf-8");
        return nextID
    }
    catch(error){
            console.error(error);
        }
    }

function nextIDCarrito(){
    let nextID
    try{
        let info=fs.readFileSync(PATH_CONFIG,'utf-8')
        info=JSON.parse(info)
        info.id_carritos= info.id_carritos +1;
        nextID=info.id_carritos

        let OBJson = JSON.stringify(info,null,2);
        fs.writeFileSync(PATH_CONFIG,OBJson,"utf-8");
        return nextID
    }
    catch(error){
            console.error(error);
        }
    }


function  saveCarrito(req, res,ruta){
    try{
        fs.readFile(ruta,'utf-8', (error, contenido)=>{
            if(error) {
                throw new Error(error);
            }else{
                let info=JSON.parse(contenido)
                
                const carrito ={
                    id: nextIDCarrito(),
                    timestamp: Date.now(),
                    productos:[]
                }

                info.push(carrito);
                let OBJson = JSON.stringify(info,null,2);
                res.status(200).json({data: `Id del carrito nuevo es ${carrito.id}`});
                console.log(info)
                fs.writeFileSync(ruta,OBJson,"utf-8");
            }
        })}
    catch(error){
            console.error(error);
        }
}

function allProducts(req, res,ruta){

    try{
        fs.readFile(ruta,'utf-8', (error, contenido)=>{
            if(error) {
                throw new Error(error);
            }else{
                if (req.params.id== undefined){
                    let info=JSON.parse(contenido)
                    res.status(200).json({msg: "Todos los productos:" ,data: info});
                }
                else {
                    let info=JSON.parse(contenido)
                    console.log(req.params.id)
                    const producto=info.find(x => x.id == req.params.id);
                    console.log(producto)
                    if (producto != undefined){
                        res.status(200).json({msg: "producto encontrado por id:" ,data: producto});
                    }
                    else{
                        res.status(200).json({msg: "Id no encontrado en la base de datos" ,data: [] });
                    }
                }
                
            }
        })
    }
    catch(error){
            console.error(error);
        }   
}


function deleteProductos(req, res,ruta){

    try{
        fs.readFile(ruta,'utf-8', (error, contenido)=>{
            if(error) {
                throw new Error(error);
            }else{
                if (req.params.id== undefined){
                    let info=JSON.parse(contenido)
                    res.status(200).json({msg: "Todos los productos:" ,data: info});
                }
                else {
                    let info=JSON.parse(contenido)
                    console.log(req.params.id)
                    const indexProducto=info.findIndex(x => x.id == req.params.id);
                    if (indexProducto != undefined){

                        res.status(200).json({msg:"objeto eliminado",data: info[indexProducto]});

                        info.splice(indexProducto, 1);

                        let OBJson = JSON.stringify(info,null,2);
                        fs.writeFileSync(ruta,OBJson,"utf-8");
                    }
                    else {
                        res.status(200).json({msg: "producto no encontrado"});
                    }
                }
                
            }
        })
    }
    catch(error){
            console.error(error);
        }   
}


function updateProductos(req, res,ruta){

    try{
        fs.readFile(ruta,'utf-8', (error, contenido)=>{
            if(error) {
                throw new Error(error);
            }else{
                if (req.params.id== undefined){
                    let info=JSON.parse(contenido)
                    res.status(200).json({msg: "Todos los productos:" ,data: info});
                }
                else {
                    let info=JSON.parse(contenido)
                    console.log(req.params.id)
                    const indexProducto=info.findIndex(x => x.id == req.params.id);
                    if (indexProducto != undefined){

                        info[indexProducto].nombre =req.body.nombre;
                        info[indexProducto].descripcion =req.body.descripcion;
                        info[indexProducto].codigo =req.body.codigo;
                        info[indexProducto].foto =req.body.url;
                        info[indexProducto].precio =req.body.precio;
                        info[indexProducto].stock =req.body.stock;

                        let OBJson = JSON.stringify(info,null,2);
                        res.status(200).json({data: info[indexProducto]});
                        fs.writeFileSync(ruta,OBJson,"utf-8");
                    }
                    else {
                        res.status(200).json({msg: "producto no encontrado"});
                    }
                }
                
            }
        })
    }
    catch(error){
            console.error(error);
        }   
}





/*---------------------   PRODUCTOS  --------------------- */

routerProductos.get('/:id?', (req, res)=>{
    allProducts(req, res,PATH_PRODUCTOS)
})

routerProductos.post('/', (req, res)=>{
    saveProducto(req,res,PATH_PRODUCTOS)
})


routerProductos.put('/:id', (req, res)=>{
    updateProductos(req,res,PATH_PRODUCTOS)
})

routerProductos.delete('/:id', (req, res)=>{
    deleteProductos(req,res,PATH_PRODUCTOS)
})



/*---------------------   CARRITO  --------------------- */

routerCarrito.get('/:id/productos', (req, res)=>{
  
})

routerCarrito.post('/', (req, res)=>{
    saveCarrito(req,res,PATH_CARRITO)
})


routerCarrito.post('/:id/productos', (req, res)=>{

})

routerCarrito.delete('/:id', (req, res)=>{

})

routerCarrito.delete('/:id/productos/:id_prod', (req, res)=>{

})



/* ---------------------- Routers ----------------------*/


/*Agregamos routers a la app*/
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);


/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = app.listen(process.env.PORT  || PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
})
