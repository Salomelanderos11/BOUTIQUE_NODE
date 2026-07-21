import { object, success } from 'zod';
import Productos from '../SCHEMAS/Productos.js';
import {pool} from './conexion.js' 
const db = pool;
export class ModelProducto {

    static sql_get = `SELECT 
                            p.id,
                            p.nombre,
                            p.precio,
                            p.inventario,
                            p.descripcion,
                            -- Devuelve un arreglo JSON de strings: ["Electrónica", "Hogar"] o []
                            to_json(ARRAY(
                                SELECT c.nombre 
                                FROM categorias c
                                JOIN producto_categoria pc ON c.id = pc.categoria_id
                                WHERE pc.producto_id = p.id
                            )) AS categorias,
                            -- Devuelve un arreglo JSON de strings: ["S", "M"] o []
                            to_json(ARRAY(
                                SELECT t.nombre 
                                FROM tallas t
                                JOIN producto_talla pt ON t.id = pt.talla_id
                                WHERE pt.producto_id = p.id
                            )) AS tallas,
                            -- Devuelve un arreglo JSON de strings: ["Rojo", "Azul"] o []
                            to_json(ARRAY(
                                SELECT col.nombre 
                                FROM colores col
                                JOIN producto_color pcol ON col.id = pcol.color_id
                                WHERE pcol.producto_id = p.id
                            )) AS colores
                        FROM productos p `;
    static async getAll({categoria}) {
        try {
            let sql = this.sql_get
            let res;
            if(categoria&& categoria !=null){
                const id_cat =(await db.query( 'select id from categorias where nombre = $1',[categoria])).rows
                if(id_cat.length ==0) return {succes:false,message:'categoria invalida'}
       
                sql = this.sql_get + ` WHERE EXISTS (
                                        SELECT 1 FROM producto_categoria pc 
                                        WHERE pc.producto_id = p.id AND pc.categoria_id = $1
                                    )`
                
                res = await db.query(sql,[id_cat[0].id])
            }
            else{
                res = await db.query(sql)
            }

            if(res.rows.length >0){
                return {succes:true,productos: res.rows}
            }
            else{
                return {succes:false,message:'no se encontraron productos compatibles'}
            }

        } catch (error) {
            console.error("sucedio un error al ejecutar : ",error.message)
            
            return {err:error.message} 
            
        }
        
    }

    static async getId ({id}){
        try {
         
        const sql = this.sql_get +' where id = $1'
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
            //console.log(columnas)
            let valores = Object.values(producto)
            const indices = []
            const valores_act = columnas.map((col, index) =>{
                let ind;
                switch (col) {
                    case "tallas":
                        ind = {val:valores[index],key:"tallas"}
                        indices.push(ind)
                        return null
                        break;
                    case "colores":
                        ind = {val:valores[index],key:"colores"}
                        indices.push(ind)
                        return null
                        break;
                    case "categorias":
                        ind = {val:valores[index],key:"categorias"}
                        indices.push(ind)
                        return null
                        break;    
                    default:
                        break;
                }
                
                return `${col} = $${index+1}`
            }).filter(key => key !=null).join(',')
            console.log(valores_act)
            valores = valores.filter(e => !Array.isArray(e))
            valores.push(id)
            console.log(valores, indices)
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