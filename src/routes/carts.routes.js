import { Router } from "express";
import { CartManagerDB } from "../dao/managers/dbMangers/CartManagerDB.js";

//import cartsModel from "../dao/models/carts.model.js";

const cartManagerDB = new CartManagerDB();

const router = Router();

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  
  try {
    //const cart = await cartsModel.findById({ _id: cid });
    const cart = await cartManagerDB.getIdCart(cid);
      // console.log("---Cart---")
      // console.log(cart)
      const products = cart.products;
      //console.log(JSON.stringify(cart,null,'\t'));

      //console.log(JSON.stringify(products,null,'\t'));
      //console.log(JSON.stringify(products[1].product.title,null,'\t'));

      const productsAux = products.map(producto => {
          const prod = {
              title: producto.product.title,
              description: producto.product.description,
              code: producto.product.code,
              price: producto.product.price,
              status: producto.product.status,
              stock: producto.product.stock,
              category: producto.product.category,
              thumbnails: producto.product.thumbnails,
              quantity: producto.quantity
          }
          return (prod);
      })
      
      //console.log("---productsAux---" + JSON.stringify(productsAux,null,'\t') );
      //console.log("Producto 0: " + productsAux[0].title)
       //Habilitar para la entrega
      res.render("cartProducts", {productsAux} );
  
      //Comentar. Solo para pruebas
  //   res.send({
  //     status: "succes",
  //     msg: `Ruta GET ID CART con ID: ${cid}`,
  //     //cart,
  //     productsAux
  //   });
      //-------Fin solo para pruebas
  } catch {
    console.log("Error en lectura de archivos!!");
  }

});

router.get("/", async (req, res) => {
 
  try {
    //const carts = await cartsModel.find();
    const carts = await cartManagerDB.getCarts();
    //console.log(carts)
    res.send({
      status: "succes",
      carts,
    });
  } catch {
    console.log("Error en lectura de archivos!!");
  }
});

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  
  try {
    
    const cart = await cartManagerDB.getIdCart(cid);
 
    res.send({
      status: "succes",
      msg: `Ruta GET ID CART con ID: ${cid}`,
      cart,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(404).send({
        status: "error",
        msg: error.message,
    });
  }
});

//Se crea el Carrito, con array products vacio
router.post("/", async (req, res) => {
  // const cart = {
  //   products: [],
  // };
  
  try {
    //const carts = await cartsModel.create(cart);
    const carts = await cartManagerDB.createCarts();
    res.send({
      status: "succes",
      msg: "Ruta POST CART",
      carts,
    });
  } catch {
    console.log("Error en lectura de archivos!!");
  }

});

//Se agrega al Carrito, un array de productos, que viene del body
router.post("/:cid", async (req, res) => {
  try {

    const cid = req.params.cid;
    const products = req.body;

    const carts = await cartManagerDB.updateCartMany(cid, products);
    res.send({
      status: "succes",
      msg: "Ruta POST CART",
      carts,
    });
  }  catch (error) {
    console.error("Error:", error.message);
    res.status(404).send({
        status: "error",
        msg: error.message,
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  //creo
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;
    try {
        const result = await cartManagerDB.updateCart(cid, pid, quantity);
        //console.log(result);
        res.send({
            status: "succes",
            msg: `Ruta POST CART - Agrego producto al carrito. CID: ${cid} - PID: ${pid}`,
            result,
          });
       }
       catch (error) {
        console.error("Error:", error.message);
        res.status(404).send({
            status: "error",
            msg: error.message,
        });
    }

});

// router.put("/:cid", async (req, res) => {
//   const cid = req.params.cid;
//   res.send({
//     status: "succes",
//     msg: `Ruta PUT de CART con ID: ${cid}`,
//   });
// });

router.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    //let result = await cartsModel.deleteOne({_id:cid})
    const result = await cartManagerDB.deleteCart(cid)
    res.send({
      status: "succes",
      msg: `Ruta DELETE de CART con ID: ${cid}`,
    });
  } catch (error) {
      console.error("Error:", error.message);
      res.status(404).send({
          status: "error",
          msg: error.message,
      });
  }

});

router.delete("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    //let result = await cartsModel.deleteOne({_id:cid})
    const result = await cartManagerDB.deleteProductCart(cid, pid)
    res.send({
      status: "succes",
      msg: `Ruta DELETE de producto con ID ${pid} en el carrito con ID: ${cid} y `,
    });
  }  catch (error) {
    console.error("Error:", error.message);
    res.status(404).send({
        status: "error",
        msg: error.message,
    });
}

});

export { router as cartRouter };
