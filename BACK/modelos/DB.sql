select * from categorias p 
inner join categorias ca


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



-----------------------------------------------------------------
-----------------------------------------------------------------
-----------------------------------------------------------------
SELECT 
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
FROM productos p;


-----------------------------------------------------------------
-----------------------------------------------------------------
-----------------------------------------------------------------

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
    FOR v_item IN SELECT jsonb_array_elements_text(p_producto_datos->'categorias') LOOP
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



select * from productos where id  = 6