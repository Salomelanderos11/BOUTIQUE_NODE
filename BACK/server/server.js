import express  from 'express'
import cors from 'cors'
import { Router } from 'express'

const port  = process.env.PORT ?? 1234
 const server = express()

 server.use(express.json())
 server.use(cors())

 server.listen(port, () => {
    console.log(`servidor escuchando desde http://localhost:${port}`);
 })
