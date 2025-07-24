-- Crear tabla de anuncios
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Agregar algunos anuncios de ejemplo
INSERT INTO announcements (title, description, date)
VALUES (
        'Mi Primer Anuncio',
        'Este es mi primer anuncio de prueba',
        NOW()
    ),
    (
        'Segundo Anuncio',
        'Este es otro anuncio para probar',
        NOW()
    );