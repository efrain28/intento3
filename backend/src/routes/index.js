const {Router} = require('express');
const router = Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken');

router.get('/', (req, res)=> res.send('Hello word'))

router.post('/signup', async(req, res) => {
    const {email, password}= req.body;
    
    const newUser = new User({email, password});
    await newUser.save();
    
    const token = jwt.sign({_id: newUser._id}, 'palabrasecreta')
    res.status(200).json({token})
})

router.post('/signin', async(req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email})
    
    if (!user) return res.status(401).send("El email no existe");
    if (user.password !== password) return res.status(401).send("Password incorrecto");

    const token = jwt.sign({_id: user._id}, 'palabrasecreta');
    return res.status(200).json({token});
})

router.get('/tasks', (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Respuesta uno',
            descripcion: 'logrado',
            date: "2020-08-02T19:56:36.536Z"
        },
        {
            _id: 2,
            name: 'Respuesta dos',
            descripcion: 'logrado',
            date: "2020-08-02T19:56:36.536Z"
        },
        {
            _id: 3,
            name: 'Respuesta tres',
            descripcion: 'logrado',
            date: "2020-08-02T19:56:36.536Z"
        }
    ])
})

router.get('/private-tasks', verificarToken,(req, res)=>{
    res.json([
        {
            _id: 1,
            name: 'Respuesta uno',
            descripcion: 'logrado',
            date: "2020-08-02T19:56:36.536Z"
        },
        {
            _id: 2,
            name: 'Respuesta dos',
            descripcion: 'logrado',
            date: "2020-08-02T19:56:36.536Z"
        },
        {
            _id: 3,
            name: 'Respuesta tres',
            descripcion: 'logrado',
            date: "2020-08-02T19:56:36.536Z"
        }
    ])
})

router.get('/perfil', verificarToken, (req, res)=>{
    res.send(req.userId);
})

module.exports = router;

function verificarToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('No autorizado');
    }

    const token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
        return res.status(401).send('No autorizado');
    }

    const payload = jwt.verify(token,'palabrasecreta')
    req.userId = payload._id
    next();
}