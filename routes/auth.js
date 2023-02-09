const router = require('express').Router()
const User = require('../models/User')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//const { schema } = require('../models/User')
//const { json } = require('body-parser')

const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    lastname: Joi.string().max(255).required(),
    email: Joi.string().max(1024).required(),
    password: Joi.string().min(6).required()
})

const schemaUpdate = Joi.object({
    id: Joi.string().max(1024).required(),
    name: Joi.string().min(6).max(255).required(),
    lastname: Joi.string().max(255).required(),
    email: Joi.string().max(1024).required(),
    password: Joi.string().min(6).required()
})

//const schemaUpdateusers = Joi.object({
  //  id: Joi.string().max(1024).required(),
    //name: Joi.string().min(6).max(255).required(),
   // lastname: Joi.string().max(255).required(),
    //password: Joi.string().min(6).required()
//})

const schemaLogin = Joi.object({
    email: Joi.string().max(1024).required(),
    password: Joi.string().min(6).required()
})


// ----------------------Método para Registrar------------------------
router.post('/register', async(req, res) => {
    // Validación de Usuario
    const { error } = schemaRegister.validate(req.body)
    
    if(error){
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const isEmailUnique = await User.findOne({ email: req.body.email })
    if(isEmailUnique){
        return res.status(400).json({
            error: "El correo ya existe"
        })
    }

    const salt = await bcrypt.genSalt(10)
    const passswordEncriptado = await bcrypt.hash(req.body.password, salt)


    const usuario = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: passswordEncriptado 
    })

    //res.json({
      //  error: null,
        //data: 'Aquí vamos a poner los datos'
    //})

    try{
        const guardado = await usuario.save()
        res.json({
            message: 'Success',
            data: guardado
        })

    }catch(error){
        res.status(400).json({
            message: 'Error al Guardar',
            error
        })
    }
}) 

// ----------------------Método de login------------------------
router.post('/login', async(req, res) => {
    // Login de ususario
    const { error } = schemaLogin.validate(req.body)
    
    if(error){
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const isEmailUnique = await User.findOne({ email: req.body.email })//El findOne es como un select con un where
    if(!isEmailUnique){
        return res.status(400).json({
            error: "El correo no existe"
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, isEmailUnique.password)

    if(!validPassword){
        return res.status(400).json({
            error: "Password incorrecto"
        })
    }

    const token = jwt.sign({
        name: isEmailUnique.name,
        id: isEmailUnique._id
    }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
        error: null,
        data: { token }
    })
})

router.get('/getallusers', async(req, res) => {
    const users = await User.find()//find es in select

    if(users){
        res.json({
            error: null,
            data: users
        })
    }else {
        return res.status(400).json({
            error: "No hay usuarios"
        })
    }
})

//------------------Método de borrado---------------------
router.post('/eraseuser', async(req, res) => {
    const id = req.body.id

    const erased = await User.findByIdAndDelete(id)

    if(erased){
        res.json({
            error: null,
            message: "Borrado satisfactoriamente"
        })
    }else{
        return res.status(400).json({
            error: "No se pudo borrar el usuario"
        })
    }
})



// ----------------------Método para Actualizar datos------------------------


/*router.post('/update', async(req, res) => {
    // Actualización de Usuario
    const id = req.body.id

    const salt = await bcrypt.genSalt(10)
    const passswordEncriptado = await bcrypt.hash(req.body.password, salt)


    const usuario = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.lastname,
        password: passswordEncriptado 
    }

    try{
        const actualizado = await User.findByIdAndUpdate(id, {$set: {
            name: usuario.name,
            lastname: usuario.lastname,
            email: req.body.lastname,
            password: passswordEncriptado 
        }})
        res.json({
            message: 'Success',
            data: actualizado
        })

    }catch(error){
        res.status(400).json({
            message: 'Error al actualizar',
            error
        })
    }
}) */






// ----------------------Método para Actualizar------------------------
router.post('/update', async(req, res) => {
    // Validación de Usuario
    const { error } = schemaUpdate.validate(req.body)
    
    if(error){
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const isEmailUnique = await User.findOne({ email: req.body.email })
    if(isEmailUnique){
        return res.status(400).json({
            error: "El correo ya existe"
        })
    }

    const salt = await bcrypt.genSalt(10)
    const passswordEncriptado = await bcrypt.hash(req.body.password, salt)


    const usuario = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: passswordEncriptado 
    }

    //res.json({
      //  error: null,
        //data: 'Aquí vamos a poner los datos'
    //})

    try{
        const actualizar = await User.findByIdAndUpdate(req.body.id, usuario, { new: true})
        res.json({
            message: 'Success',
            data: actualizar
        })

    }catch(error){
        res.status(400).json({
            message: 'Error al actualizar',
            error
        })
    }
}) 

module.exports = router