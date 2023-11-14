const express = require('express')
const router = express.Router()
const {v4: uuidv4} = require('uuid');

const { readFile, writeFile } = require('../file');
const {models} = require('../../libs/sequelize');

const File_Name = './db/deportes.txt';
const { DeporteModel } = require('../models'); // Asegúrate de importar tu modelo Sequelize

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