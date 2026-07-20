import { Router } from "express";
import {ModelProducto} from '../modelos/Producto.js'
import {controllerProducto} from '../controladores/Productos.js'

export const  crear_router = ({ModelProducto}) =>{
    const router = Router();
    const controller = new controllerProducto({ModelProducto})
    router.post('/',controller.insert)
    router.get('/',controller.getAll)
    router.get('/:id',controller.getId)
    router.patch('/:id',controller.update_parcial)
    router.delete('/:id',controller.delete)
    return router
}
 
/*
export const createMovieRouter = ({MovieModel}) =>
{   const Rmovies = Router()
    const movieController = new MovieController({MovieModel})
    Rmovies.get('/',movieController.getAll)

    Rmovies.get('/:id',movieController.getid)

    Rmovies.post('/', movieController.create)

    Rmovies.delete('/:id', movieController.delete)

    Rmovies.patch('/:id', movieController.update )
    return Rmovies
}*/
