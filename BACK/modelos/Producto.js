import {pool} from './conexion'
const db = pool;
export class ModelProducto {
    static async getAll({categoria}) {
        try {
            const sql = 'select * from productos '

            if(categoria&& categoria !=null){
                sql = 'select * from productos where categoria = 1$'
            }
            const res = await db.query(sql,[categoria])
            if(res.rows[0] !=null){
                return res.rows
            }
            else{
                return 'no se encontraron productos compatibles'
            }

        } catch (error) {
            console.error("sucedio un error al ejecutar : ",error.message)
            
            return {err:error.message} 
            
        }
        
    }

    static async getId ({id}){
        try {
         
        const sql = 'select* from produtos where id = 1$'
        const res = await db.query(sql,[id])
        if(res.rows[0]!= null) return res.rows[0]
        
        return "No se encontro el producto solicitado"
        } catch (error) {
            console.error("sucedio un error al ejecutar : ",error.message)
            
            return {err:error.message}
        }
    }

    static async insert ({producto}){
        const sql = 'call '
    }
}