import { Router } from "express";
import userModel from '../dao/models/users.model.js'
import {createHash, validatePassword} from "../utils.js"
import passport from "passport";


const router = Router();

/* router.post("/register", async (req,res)=>{
   const { first_name, last_name, email, age, password } = req.body;

   const exists = await userModel.findOne({email});

   if(exists){
    return res.status(400)
    .send({
        status:"error",
        error:"El usuario ya existe"
    })
   }
   const user = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
    }

    let result = await userModel.create(user);

    return res.status(400)
    .send({
        status:"success",
        message:"Usuario registrado"
    })
}) */

router.post("/register",passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}),
async (req,res) => {
    res.send({status:"success", message:"User registrado"})
})

router.get("/failregister", async (req,res)=>{
    console.log('Fallo el registro');
    res.send({error: 'fallo en el registro'})
})

/* router.post("/login", async (req,res)=>{
    const rol = 'user';
    const {email, password} = req.body;
    if (email.toLowerCase() === 'adminCoder@coder.com'.toLowerCase() && password === 'adminCoder3r123' ){
        req.session.user = {
            full_name: email,
            email: email,
            age: 0,
            rol: 'Admin'
        }
    }else {
        const user = await userModel.findOne({email});
    
        if(!user){
        return res.status(400).send({
                status:"error",
                error:"Datos incorrectos"
            })
        }
        const isValidPassword = validatePassword(password, user);

        if(!isValidPassword){
            return res.status(400).send({
                status:"error",
                error:"Datos incorrectos"
            })
        }
        req.session.user = {
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol
        }
    }
    res.send({
            status:"success",
            payload: req.session.user,
            message:"Mi primer Login!!"
        })
    }) */
    
router.get("/current", async (req,res)=>{
    const user = req.session.user;
    if (!user) {
        res.send({
            status: "error",
            msg: "No hay usuario activo"
        });
    }
    res.send({
        status: "succes",
        msg: "Usuario actual",
        user
      });
})

router.post("/login", passport.authenticate("login", {failureRedirect:'/api/session/faillogin'}),
async (req,res) =>{ 
    if(!req.user){
        return res.status(400).send({status:"error"})
    }
    req.session.user ={
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age:req.user.age,
        email:req.user.email,
        role: req.user.role
    }
    res.send({status:"success", payload:req.user})
})

router.get("/faillogin", (req,res)=>{
    res.send({error:"fail login"})
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send({
                status: 'error',
                error: 'No se pudo desloguear'
            })
        }
        res.redirect('/login')
    })
})


router.post("/restartPassword", async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send(
        res.send({
            status:"error",
            message:"Datos incorrectos"
        })
    )
    const user = await userModel.findOne({email});
    if(!user) return res.status(400).send(
        res.send({
            status:"error",
            message:"No existe el usuario"
        })
    )
    const newHashPassword = createHash(password);

    await userModel.updateOne({_id:user._id},{$set:{password:newHashPassword}});
    res.send({
        status:"success",
        message:"contraseña restaurada"
    })
})

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user;
    res.redirect("/")
});

export default router;