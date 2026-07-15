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