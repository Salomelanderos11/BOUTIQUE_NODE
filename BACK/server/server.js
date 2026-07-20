import express  from 'express'
import cors from 'cors'
import { crear_router} from '../routes/productos.js'

export const crear_app = ({ModelProducto})=>{
   
      const port  = process.env.PORT ?? 1234
      const server = express() 
      server.disable('x-powered-by')
      server.use(express.json())
      server.use(cors())
      server.use('/productos',crear_router({ModelProducto}))
      server.use((req, res) =>{
         res.status(404).send('<h1>404 pagina no encontrada.</h1>')
      })

      server.listen(port, () => {
         console.log(`servidor escuchando desde http://localhost:${port}`);
      })
      return server
   }

