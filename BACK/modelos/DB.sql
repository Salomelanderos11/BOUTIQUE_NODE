select * from productos


-- 1. Crear tablas maestras independientes
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE tallas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE colores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Crear la tabla principal de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    inventario INT NOT NULL DEFAULT 0,
    descripcion TEXT
);

-- 3. Crear tablas relacionales (Muchos a Muchos) con eliminación en cascada

CREATE TABLE producto_categoria (
    producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
    categoria_id INT REFERENCES categorias(id) ON DELETE CASCADE,
    PRIMARY KEY (producto_id, categoria_id)
);

CREATE TABLE producto_talla (
    producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
    talla_id INT REFERENCES tallas(id) ON DELETE CASCADE,
    PRIMARY KEY (producto_id, talla_id)
);

CREATE TABLE producto_color (
    producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
    color_id INT REFERENCES colores(id) ON DELETE CASCADE,
    PRIMARY KEY (producto_id, color_id)
);




CREATE OR REPLACE PROCEDURE insertar_producto(
    IN p_producto_datos JSONB,
    OUT p_producto_id INT
)
AS $$
DECLARE
    v_item TEXT;
    v_cat_id INT;
    v_col_id INT;
    v_tal_id INT;
BEGIN
    -- 1. Insertar el producto extrayendo los datos básicos del JSONB
    INSERT INTO productos (nombre, precio, inventario, descripcion)
    VALUES (
        (p_producto_datos->>'nombre')::VARCHAR,
        (p_producto_datos->>'precio')::DECIMAL,
        (p_producto_datos->>'inventario')::INT,
        (p_producto_datos->>'descripcion')::TEXT
    )
    RETURNING id INTO p_producto_id;

    -- 2. Procesar e insertar categorías asociadas
    FOR v_item IN SELECT jsonb_array_elements_text(p_producto_datos->'categoria') LOOP
        SELECT id INTO v_cat_id FROM categorias WHERE nombre = v_item;
        
        IF v_cat_id IS NOT NULL THEN
            INSERT INTO producto_categoria (producto_id, categoria_id)
            VALUES (p_producto_id, v_cat_id)
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;

    -- 3. Procesar e insertar colores asociados
    FOR v_item IN SELECT jsonb_array_elements_text(p_producto_datos->'colores') LOOP
        SELECT id INTO v_col_id FROM colores WHERE nombre = v_item;
        
        IF v_col_id IS NOT NULL THEN
            INSERT INTO producto_color (producto_id, color_id)
            VALUES (p_producto_id, v_col_id)
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;

    -- 4. Procesar e insertar tallas asociadas
    FOR v_item IN SELECT jsonb_array_elements_text(p_producto_datos->'tallas') LOOP
        SELECT id INTO v_tal_id FROM tallas WHERE nombre = v_item;
        
        IF v_tal_id IS NOT NULL THEN
            INSERT INTO producto_talla (producto_id, talla_id)
            VALUES (p_producto_id, v_tal_id)
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


SELECT 
    p.id,
    p.nombre,
    p.precio,
    p.inventario,
    p.descripcion,
    -- Agrupamos las categorías en un arreglo de texto
    COALESCE(json_agg(DISTINCT c.nombre) FILTER (WHERE c.nombre IS NOT NULL), '[]') AS categorias,
    -- Agrupamos los colores en un arreglo de texto
    COALESCE(json_agg(DISTINCT col.nombre) FILTER (WHERE col.nombre IS NOT NULL), '[]') AS colores,
    -- Agrupamos las tallas en un arreglo de texto
    COALESCE(json_agg(DISTINCT t.nombre) FILTER (WHERE t.nombre IS NOT NULL), '[]') AS tallas
FROM productos p
-- Joins para Categorías
LEFT JOIN producto_categoria pc ON p.id = pc.producto_id
LEFT JOIN categorias c ON pc.categoria_id = c.id
-- Joins para Colores
LEFT JOIN producto_color pcol ON p.id = pcol.producto_id
LEFT JOIN colores col ON pcol.color_id = col.id
-- Joins para Tallas
LEFT JOIN producto_talla pt ON p.id = pt.producto_id
LEFT JOIN tallas t ON pt.talla_id = t.id
-- Agrupamos por el ID del producto para que no se dupliquen registros
GROUP BY p.id;


select * from colores


INSERT INTO tallas (nombre) VALUES
('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL'), 
('Unitalla'), ('Oversize'),
('5'), ('7'), ('9'), ('11'), ('13'), ('15'), ('17'), ('19'), ('21'), ('23'), ('24'),
('26'), ('28'), ('30'), ('32'), ('34'), ('36'), ('38'), ('40')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO categorias (nombre) VALUES
('Pantalones'),
('Jeans'),
('Joggers'),
('Leggings'),
('Shorts'),
('Faldas'),
('Blusas'),
('Playeras'),
('Camisas'),
('Sacos'),
('Suéteres'),
('Sudaderas'),
('Vestidos'),
('Conjuntos'),
('Lencería'),
('Pijamas'),
('Trajes de Baño')
ON CONFLICT (nombre) DO NOTHING;


INSERT INTO colores (nombre) VALUES
('Negro'),
('Blanco'),
('Gris Oxford'),
('Gris Jaspe'),
('Beige'),
('Hueso'),
('Café'),
('Azul Marino'),
('Azul Rey'),
('Azul Cielo'),
('Rojo'),
('Tinto'),
('Rosa Pastel'),
('Rosa Fucsia'),
('Verde Militar'),
('Verde Esmeralda'),
('Verde Menta'),
('Mostaza'),
('Amarillo'),
('Naranja'),
('Lila'),
('Morado'),
('Coral'),
('Turquesa'),
('Mezclilla Claro'),
('Mezclilla Medio'),
('Mezclilla Oscuro'),
('Plata'),
('Oro'),
('Multicolor')
ON CONFLICT (nombre) DO NOTHING;