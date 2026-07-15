import z from 'zod'
import { de } from 'zod/v4/locales'

const schemaProducto = z.object(
    {
        nombre: z.string({invad_type_eorr : 'el titulo debe seer un string  ',
            required_error: ' el nombre es requerido'}),
        precio: z.number({invad_type_eorr : 'el Precio debe ser un un numero.',
            required_error: ' el Precio es requerido'}).min(10),
        inventario: z.number({invad_type_eorr : 'el inventario debe ser un un numero.',
            required_error: ' el inventario es requerido'}).min(1),
        descripcion: z.string(),
        colores: z.array(z.enum([
                                "Negro",
                                "Blanco",
                                "Gris Oxford",
                                "Gris Jaspe",
                                "Beige",
                                "Hueso",
                                "Café",
                                "Azul Marino",
                                "Azul Rey",
                                "Azul Cielo",
                                "Rojo",
                                "Tinto",
                                "Rosa Pastel",
                                "Rosa Fucsia",
                                "Verde Militar",
                                "Verde Esmeralda",
                                "Verde Menta",
                                "Mostaza",
                                "Amarillo",
                                "Naranja",
                                "Lila",
                                "Morado",
                                "Coral",
                                "Turquesa",
                                "Mezclilla Claro",
                                "Mezclilla Medio",
                                "Mezclilla Oscuro",
                                "Plata",
                                "Oro",
                                "Multicolor"
                                ])),
        categorias: z.array(z.enum([
                                    "Pantalones",
                                    "Jeans",
                                    "Joggers",
                                    "Leggings",
                                    "Shorts",
                                    "Faldas",
                                    "Blusas",
                                    "Playeras",
                                    "Camisas",
                                    "Sacos",
                                    "Suéteres",
                                    "Sudaderas",
                                    "Vestidos",
                                    "Conjuntos",
                                    "Lencería",
                                    "Pijamas",
                                    "Trajes de Baño"
                                    ])),
        tallas:z.array(z.enum([
                                "XS",
                                "S",
                                "M",
                                "L",
                                "XL",
                                "XXL",
                                "Unitalla",
                                "Oversize",
                                "5",
                                "7",
                                "9",
                                "11",
                                "13",
                                "15",
                                "17",
                                "19",
                                "21",
                                "23",
                                "24",
                                "26",
                                "28",
                                "30",
                                "32",
                                "34",
                                "36",
                                "38",
                                "40"
                                ]))

    }
)

export function validarProducto(object){
    const createschema = schemaProducto
    return createschema.safeParse(object)
}

export function validarParcial (object){
    return schemaProducto.partial().safeParse(object)
}

export default { validarProducto,validarParcial}
