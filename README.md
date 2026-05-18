# MovieStream NoSQL

CRUD app de MovieStream con Express, EJS, Mongoose y MongoDB.

## Instalacion

```bash
npm install
```

Configura `.env`:

```env
MONGODB_URI=tu_uri_de_mongodb_atlas
PORT=3000
```

## Datos semilla

```bash
npm run seed
```

## Ejecutar localmente

```bash
npm run dev
```

Abre:

```txt
http://localhost:3000
```

## Funcionalidad

- CRUD de peliculas.
- Busqueda de peliculas por titulo.
- Filtro de peliculas por genero.
- Seleccion multiple de generos y actores.
- CRUD de generos.
- Al borrar un genero, se elimina la referencia en las peliculas relacionadas.

## Deployment en Render

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

Variables de entorno:

```txt
MONGODB_URI=tu_uri_de_mongodb_atlas
```

En MongoDB Atlas, permite acceso desde Render. Para proyecto escolar se suele usar `0.0.0.0/0`.
