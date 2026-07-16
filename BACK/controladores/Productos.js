import { Router } from "express";
import { ModelProducto } from "../modelos/Producto.js";
import { validarProducto,validarParcial } from "../SCHEMAS/Productos.js";


export class controllerProducto {


static  insert = async  (req, res) => {
    try {
        const objeto = req.body
       // console.log(objeto)
        const resultado = validarProducto(objeto)

        if(resultado.error){
            return res.status(400).json({error: JSON.parse(resultado.error.message)})
        }
        const new_producto = await ModelProducto.insert({producto: resultado.data})
        
        res.status(201).json({oks: new_producto})
        console.log('creado')

    } catch (error) {
        return error.message
        
    }
}


}