import { success } from 'zod';
import Productos from '../SCHEMAS/Productos.js';
import {pool} from './conexion.js' 
const db = pool;
export class ModelProducto {
    static async getAll({categoria}) {
        try {
            const sql = 'select * from productos '
            let res;
            if(categoria&& categoria !=null){
                sql = 'select * from productos where categoria = 1$'
                res = await db.query(sql,[categoria])
            }
            else{
                res = await db.query(sql)
            }

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
         
        const sql = 'select * from productos where id = $1'
        const res = await db.query(sql,[id])
        if(res.rows[0]!= null) return res.rows[0]
        
        return "No se encontro el producto solicitado"
        } catch (error) {
            console.error("sucedio un error al ejecutar : ",error.message)
            
            return {err:error.message}
        }
    }

    static async insert ({producto}){
        try {
         
        const sql = 'call insertar_producto($1,$2)'
        console.log('primer')
        const res = await db.query(sql,[producto,null])
        console.log(res)
        if(res.rows[0] != null){
            const sqlselect = 'select * from productos where id = $1'
            const resp = await db.query(sqlselect,[res.rows[0].p_producto_id])
            console.log('segundo')
            return resp.rows
        }   
        } catch (error) {
            console.error('ocurrio un error ',error.message)
            return error.message
        }
        
    }

    static async update_parcial ({id,producto}){
        try {
            const columnas = Object.keys(producto)
            const valores = Object.values(producto)
            const valores_act = columnas.map((col, index) =>{
                return `${col} = $${index+1}`
            }).join(',')
            console.log(valores_act)
            valores.push(id)
            const sql = `update productos set ${valores_act} where id = $${valores.length}`
            const res = await db.query(sql,valores)
            if(res.rowCount > 0){
                const sql = 'select * from productos where id = $1'
                const res = await db.query(sql,[id])
                return {succes:true,res:res.rows}
            }
            else{
                return {succes:false,res:'no se pudo actualizar el producto'}
            }
        } catch (error) {
            console.error('ocurrio un error ',error.message)
            return error.message
            
        }
    }

    static async delete ({id}){
        try {
            const sql = 'delete from productos where id = $1'
            const res = await db.query(sql,[id])
            if(res.rowCount > 0) return true
            return false
        } catch (error) {
            console.error(error.message)

            return error.message
            
        }

    } 


}