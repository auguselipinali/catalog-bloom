# Catalog Bloom

Creá una app web de catálogo de productos, mobile-first, con diseño moderno, limpio y profesional (buena tipografía, espaciados consistentes, animaciones sutiles). Es la base de una plataforma SaaS multi-tenant donde cada negocio tiene su catálogo público en /c/:slug.



Por ahora hacé SOLO el catálogo público, con datos de ejemplo (un negocio ficticio de cosmética con 12 productos y 4 categorías):



- Header con logo, nombre del negocio y botón de carrito (todavía sin funcionalidad).

- Buscador y filtro por categoría (chips), y orden por precio.

- Grilla responsive de productos: imagen, nombre, precio en ARS con formato $12.500 y botón "Agregar".

- Si un producto no tiene stock: badge "Sin stock" y botón deshabilitado.

- Página de detalle del producto con galería de imágenes y descripción.

- Skeletons de carga, estado vacío cuidado y página 404.

- Color principal configurable desde una variable de tema.



Estructura el código para escalar: componentes reutilizables, tipos definidos, datos de ejemplo separados en un archivo para reemplazarlos luego por una base de datos real, y el catálogo público bien separado de lo que será el panel admin. No agregues nada más.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/205eb2fc-ce18-4469-9572-933977a80bdd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
