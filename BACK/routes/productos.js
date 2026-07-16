import { Router } from "express";
import { controllerProducto } from "../controladores/Productos.js";


export const router = Router();
router.post('/',controllerProducto.insert)

 
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
