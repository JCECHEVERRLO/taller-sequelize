//Librerias externas
const express = require('express');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const ejs = require('ejs');
const router = express.Router();
const pdfMake = require('pdfmake');
const {models} = require('./src/libs/sequelize');

// Define tus 
 //Modulos internas
 const { readFile, writeFile } = require('./src/files');

 const app = express();
 const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
 const FILE_NAME = './db/deportes.txt';

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', './src/views');
app.set('view engine', 'ejs') //DEBEMOS CREAR LA CARPETA

//Rutas
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    const students_list = ['Juan', 'Pablo', 'Lucas']
    //res.send(`Hello ${formal ? 'Mr.' : ''} 
    //${name} ${type ? ' ' + type : ''}`);
    res.render('index',{
        name : name,
        deportes : deportes_list,
    })

});

app.get('/read-file', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.send(data);
})

// punto uno filtrar 

app.get('/api/deportes', (req, res) => {
    const data = readFile(FILE_NAME);
    const idToFilter = req.query.id; // Obtener el valor del parámetro de consulta "id"

    if (idToFilter) {
        // Si se proporciona un ID, filtrar los registros por ese ID
        const filteredDeportes = data.filter(deporte => deporte.id === idToFilter);
        res.json(filteredDeportes);
    } else {
        // Si no se proporciona un ID, enviar todos los registros sin filtrar
        res.json(data);
    }
});
//WEB LISTAR Md
app.get('/deportes', (req, res) =>{
    const data = readFile(FILE_NAME);
    res.render('deportes/index', {deportes : data});
})

app.get('/deportes/create', (req,res) =>{


    
    //Mostrar el formulario
    res.render('deportes/create');
})

app.post('/deportes', (req,res) =>{
    try{
        //Leer el archivo de 
        const data = readFile(FILE_NAME);
    
        //Agregar nuevo
        const newDeporte = req.body;
        newDeporte.id = uuidv4();
        console.log(newDeporte)
        data.push(newDeporte); //agrego nuevo elemento
        //Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.redirect('/deportes')
    }catch (error){
            console.error(error);
            res.json({message: ' Error al almacenar '});
        }
})

app.delete('/deportes/delete/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    //BUSCAR  DEPORTE CON EL ID QUE RECIBE
    const deporteIndex = deportes.findIndex(deporte => deporte.id === id)
    if(deporteIndex < 0){
        res.status(404).json({'ok': false, message:"deporte not found"})
        return;
    }
    //eliminar DEPORTE en la posicion
    deportes.splice(deporteIndex,1);
    writeFile(FILE_NAME, deportes)
    res.redirect({'/deportes': true});
})
//API
//Listar DEPORTES
app.get('/api/deportes', (req,res) =>{
    const data = readFile(FILE_NAME);
    res.json(data);
})




//Crear 
app.post('/api/deportes', (req, res) => {
    try{
    //Leer 
    const data = readFile(FILE_NAME);

    //Agregar 
    const newDeporte = req.body;
    newDeporte.id = uuidv4();
    console.log(newDeporte)
    data.push(newDeporte); //agrego nuevo elemento
    //Escribir en el archivo
    writeFile(FILE_NAME, data);
    res.json({message: 'EL DEPORTE FUE CREADO'});
    }catch (error){
        console.error(error);
        res.json({message: ' Error al almacenar '});
    }

});

//Obtener una sola mascota (usamos los dos puntos por que es un path param)
app.get('/api/deportes/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const deporteFound = deportes.find(deporte => deporte.id === id)
    if(!deporteFound){
        res.status(404).json({'ok': false, message:"deporte not found"})
        return;
    }

    res.json({'ok': true, deporte: deporteFound});
})
//ACTUALIZAR UN DATO
app.put('/api/deportes/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const deporteIndex = deportes.findIndex(deporte => deporte.id === id)
    if(deporteIndex < 0){
        res.status(404).json({'ok': false, message:"deporte not found"})
        return;
    }
    let deporte = deportes[deporteIndex]; //sacar del arreglo
    deporte={...deporte, ...req.body}
    deportes[deporteIndex] = deporte //Poner deporte en el mismo lugar
    writeFile(FILE_NAME, deportes);
    //SI LA MASCOTA EXISTE MODIFICAR LOS DATOS Y ALMACENAR NUEVAMENTE


    res.json({'ok': true, deporte: deporte});
})

//Delete, eliminar un dato
app.delete('/api/deportes/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const deportes = readFile(FILE_NAME)

    // CON EL ID QUE RECIBE
    const deporteIndex = deportes.findIndex(deporte => deporte.id === id)
    if(deporteIndex < 0){
        res.status(404).json({'ok': false, message:"deporte not found"})
        return;
    }
    //eliminar la mascota en la posicion
    deportes.splice(deporteIndex,1);
    writeFile(FILE_NAME, deportes)
    res.json({'ok': true});
})


// Obtener todos los deportes
router.get('/deportes', async (req, res) => {
  try {
    const deportes = await DeporteModel.findAll();
    res.render('deportes/index', { deportes, search: req.query.search || '' });
  } catch (error) {
    console.error('Error al obtener deportes:', error);
    res.status(500).json({ error: 'Error al obtener deportes' });
  }
});

// Obtener un deporte por ID
router.get('/deportes/:id', async (req, res) => {
  const deporteId = req.params.id;
  try {
    const deporte = await DeporteModel.findByPk(deporteId);
    if (deporte) {
      res.render('deportes/show', { deporte });
    } else {
      res.status(404).json({ error: 'Deporte no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener deporte por ID:', error);
    res.status(500).json({ error: 'Error al obtener deporte por ID' });
  }
});

// Crear un nuevo deporte (formulario)
router.get('/deportes/create', (req, res) => {
  res.render('deportes/create');
});

// Procesar la creación del nuevo deporte
router.post('/deportes', async (req, res) => {
  const nuevoDeporte = req.body;
  try {
    const deporteCreado = await DeporteModel.create(nuevoDeporte);
    res.redirect('/deportes');
  } catch (error) {
    console.error('Error al crear deporte:', error);
    res.status(500).json({ error: 'Error al crear deporte' });
  }
});

// Actualizar un deporte por ID (formulario)
router.get('/deportes/:id/edit', async (req, res) => {
  const deporteId = req.params.id;
  try {
    const deporte = await DeporteModel.findByPk(deporteId);
    if (deporte) {
      res.render('deportes/edit', { deporte });
    } else {
      res.status(404).json({ error: 'Deporte no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener deporte por ID:', error);
    res.status(500).json({ error: 'Error al obtener deporte por ID' });
  }
});

// Procesar la actualización del deporte
router.put('/deportes/:id', async (req, res) => {
  const deporteId = req.params.id;
  const datosActualizados = req.body;
  try {
    const deporte = await DeporteModel.findByPk(deporteId);
    if (deporte) {
      await deporte.update(datosActualizados);
      res.redirect(`/deportes/${deporteId}`);
    } else {
      res.status(404).json({ error: 'Deporte no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar deporte por ID:', error);
    res.status(500).json({ error: 'Error al actualizar deporte por ID' });
  }
});

// Eliminar un deporte por ID
router.delete('/deportes/:id', async (req, res) => {
  const deporteId = req.params.id;
  try {
    const deporte = await DeporteModel.findByPk(deporteId);
    if (deporte) {
      await deporte.destroy();
      res.redirect('/deportes');
    } else {
      res.status(404).json({ error: 'Deporte no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar deporte por ID:', error);
    res.status(500).json({ error: 'Error al eliminar deporte por ID' });
  }
});

module.exports = router;



app.listen(3000, () => {
    console.log(`${APP_NAME} está corriendo en http://localhost:${PORT}`);
});