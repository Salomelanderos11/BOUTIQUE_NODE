import { Router } from "express";
import { ModelProducto } from "../modelos/Producto.js";
import { validarProducto,validarParcial } from "../SCHEMAS/Productos.js";


export class controllerProducto {
    constructor ({ModelProducto}){
        this.ModelProducto = ModelProducto; 
    }


    insert = async  (req, res) => {
        try {
            const objeto = req.body
        // console.log(objeto)
            const resultado = validarProducto(objeto)

            if(resultado.error){
                return res.status(400).json({error: JSON.parse(resultado.error.message)})
            }
            const new_producto = await this.ModelProducto.insert({producto: resultado.data})
            
            res.status(201).json({oks: new_producto})
            console.log('creado')

        } catch (error) {
            return error.message        
        }
    }

    
    getAll = async(req, res ) =>{
        try {
            const {categoria }= req.query
            

                const resultado = await this.ModelProducto.getAll({categoria})    

            if(resultado.length ==0 ){
                return res.status(404).json({mensaje:'No se encontraron productos'})
            }
            else{
                return res.status(200).json(resultado)
            }

        } catch (error) {
            return res.status(500).json({err:error.message})
            
        }
    }

    getId = async (req, res) =>{
            try {
                const id = req.params.id
                const resultado = await this.ModelProducto.getId({id})
                return res.status(200).json(resultado)
            } catch (error) {
                 return res.status(500).json({err:error.message})
            }
    }

    update_parcial = async (req, res)=>{

        try {
            
            const id = req.params.id
            const objeto = req.body
            const resultado = validarParcial(objeto)
            console.log('objeto')
            if(resultado.error){
                return res.status(400).json({error: JSON.parse(resultado.error.message)})
            }

            const respuesta  = await this.ModelProducto.update_parcial({id,producto:resultado.data})
            if(respuesta.succes == true) return res.status(200).json(respuesta.res)
           
            return    res.status(500).json(respuesta.res)
        } catch (error) {
            console.error(error.message)
            return res.status(500).json({err:error.message})   
        }

    }

    delete = async (req, res) =>{
        try {
            const id = req.params.id
            const resultado = await this.ModelProducto.delete({id})
            if (resultado == true) return res.status(200).json({message: 'Eliminado correctamente'})
            res.status(500).json({message:'error al eliminar'})     
        } catch (error) {
            
            console.error(error.message)
            return res.status(500).json({err:error.message})
        }
    }

}