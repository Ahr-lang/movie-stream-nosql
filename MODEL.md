 
# MovieStream - Modelo Documental en MongoDB

## 1. Contexto

MovieStream es una plataforma de streaming donde existen películas, géneros, actores, clientes, actividades de uso, sesiones, ventas, muestras de ventas y datos analíticos de churn.

El objetivo de este modelo es representar el dominio en MongoDB usando documentos, subdocumentos y referencias. La decisión principal del modelo es distinguir entre datos que pertenecen naturalmente a una entidad y datos que pueden crecer demasiado o relacionarse con varias entidades.

---

## 2. Colecciones finales

El modelo documental queda con **10 colecciones**:

1. `movies`
2. `genres`
3. `actors`
4. `customers`
5. `customerFeedback`
6. `userSessions`
7. `activities`
8. `custSales`
9. `salesSamples`
10. `movieStreamChurn`

---

## 3. Colección `movies`

La colección `movies` representa el catálogo de películas disponibles en la plataforma.

### Estructura propuesta

```json
{
  "_id": "ObjectId",
  "movieId": 101,
  "sku": "MOV-101",
  "title": "Nebula Drift",
  "year": 2024,
  "runtime": "118 min",
  "summary": "A sci-fi movie about memory and identity.",
  "imageUrl": "https://example.com/movie.jpg",
  "listPrice": 4.99,
  "mainSubject": "Space travel",
  "openingDate": "2024-06-12",
  "wikiArticle": "Nebula_Drift",

  "genres": [
    "ObjectId"
  ],

  "actors": [
    "ObjectId"
  ],

  "crew": [
    {
      "name": "Sofia Cruz",
      "role": "Director"
    }
  ],

  "commercial": {
    "gross": "$10M",
    "budget": "$3M",
    "views": 12000
  },

  "awards": [
    "Best Visual Effects"
  ],

  "nominations": [
    "Best Original Score"
  ]
}
```

### Decisión de diseño

La película se mantiene como documento principal porque es una entidad central del sistema.

Los datos simples de la película, como título, año, duración, resumen, imagen, precio y fecha de estreno, se guardan directamente dentro del documento.

Los datos que pueden tener múltiples valores, como `crew`, premios y nominaciones, se modelan como arreglos dentro de la película.

### Relación con géneros

Una película puede tener varios géneros y un género puede pertenecer a muchas películas. Por eso se usa referencia desde `movies` hacia `genres`.

```json
{
  "genres": ["ObjectId"]
}
```

La referencia va en dirección:

```txt
movies -> genres
```

No se referencia en ambas direcciones porque no es necesario guardar una lista de películas dentro de cada género. Para consultar películas por género, se puede buscar en `movies` usando el id del género.

### Relación con actores

Una película puede tener varios actores y un actor puede aparecer en varias películas. Por eso se usa referencia desde `movies` hacia `actors`.

```json
{
  "actors": ["ObjectId"]
}
```

La referencia va en dirección:

```txt
movies -> actors
```

Tampoco se referencia en ambas direcciones para evitar duplicar relaciones. Si se necesitan las películas de un actor, se consulta la colección `movies`.

---

## 4. Colección `genres`

La colección `genres` representa los géneros usados para clasificar películas, actividades y ventas.

### Estructura propuesta

```json
{
  "_id": "ObjectId",
  "genreId": 1,
  "name": "Action"
}
```

### Decisión de diseño

`genres` se mantiene como colección separada porque un género puede estar relacionado con muchas películas, actividades y ventas.

No conviene embeber el género completo dentro de cada película, porque si cambia el nombre del género habría que actualizar muchas películas.

### Relaciones

La colección `genres` es referenciada por:

```txt
movies -> genres
activities -> genres
custSales -> genres
salesSamples -> genres
```

La relación no se guarda en ambas direcciones. `genres` no necesita guardar arreglos de películas, ventas o actividades, porque eso podría crecer demasiado.

---

## 5. Colección `actors`

La colección `actors` representa actores que participan en las películas.

### Estructura propuesta

```json
{
  "_id": "ObjectId",
  "name": "Luna Reyes",
  "country": "Mexico",
  "birthYear": 1992
}
```

### Decisión de diseño

`actors` se mantiene como colección separada porque un actor puede participar en muchas películas.

Si se embebiera el actor completo dentro de cada película, habría duplicación de datos. Por ejemplo, si cambia el país o algún dato del actor, habría que actualizarlo en todas las películas donde aparece.

### Relación

La referencia se guarda en `movies`:

```txt
movies -> actors
```

Ejemplo:

```json
{
  "actors": ["ObjectId", "ObjectId"]
}
```

No se guarda una referencia inversa en `actors` para evitar duplicación de relaciones.

---

## 6. Colección `customers`

La colección `customers` representa a los usuarios o clientes de la plataforma.

Incluye datos de contacto, ubicación, demografía, perfil, segmento y encuesta.

### Estructura propuesta

```json
{
  "_id": "ObjectId",
  "customerId": 1001,

  "name": {
    "first": "Andrea",
    "last": "López"
  },

  "email": "andrea@example.com",

  "contact": {
    "streetAddress": "Av. Siempre Viva 123",
    "postalCode": "64000",
    "city": "Monterrey",
    "stateProvince": "Nuevo León",
    "country": "Mexico",
    "countryCode": "MX",
    "continent": "America",
    "location": {
      "lat": 25.6866,
      "long": -100.3161
    },
    "yearsCustomer": 2,
    "promotionResponse": 1
  },

  "demographics": {
    "age": 26,
    "commuteDistance": 12,
    "creditBalance": 1500,
    "education": "Bachelor",
    "fullTime": "Yes",
    "gender": "F",
    "householdSize": 3,
    "income": 35000,
    "incomeLevel": "Medium",
    "insufficientFundsIncidents": 0,
    "jobType": "Engineer",
    "lateMortgageRentPayments": 0,
    "maritalStatus": "Single",
    "mortgageAmount": 0,
    "numCars": 1,
    "numMortgages": 0,
    "pet": "Dog",
    "rentOwn": "Rent",
    "workExperience": 4,
    "yearsCurrentEmployer": 2,
    "yearsResidence": 3
  },

  "extension": {
    "segmentId": 3,
    "additionalProfileData": {
      "preferredDevice": "Mobile",
      "preferredLanguage": "Spanish"
    }
  },

  "segment": {
    "segmentId": 3,
    "name": "Young Professionals",
    "shortName": "YP"
  },

  "survey": {
    "completedSurvey": true,
    "rating": 5,
    "wouldRecommend": true,
    "interestedInPremiumTier": true,
    "interestedInExclusiveOfferings": false,
    "mobileDevice": true,
    "television": true
  }
}
```

### Decisión de diseño

Aquí se usa **embedding**.

Los datos de contacto, demografía, extensión, segmento y encuesta pertenecen naturalmente al cliente. Normalmente, cuando se consulta un cliente, se quiere ver su perfil completo. Por eso conviene agrupar esa información en un solo documento.

### Información embebida

```txt
customers.contact
customers.demographics
customers.extension
customers.segment
customers.survey
```

### Ventaja

Consultar el perfil completo de un cliente se vuelve simple:

```js
db.customers.findOne({ customerId: 1001 })
```

### Desventaja

No conviene embeber información que pueda crecer sin límite, como actividades, sesiones, ventas o feedback. Por eso esas entidades van en colecciones separadas.

---

## 7. Colección `customerFeedback`

La colección `customerFeedback` representa comentarios enviados por clientes.

### Estructura propuesta

```json
{
  "_id": "ObjectId",
  "customer": "ObjectId",
  "customerId": 1001,
  "userId": "user_1001",
  "day": "2026-05-12",
  "email": "andrea@example.com",

  "location": {
    "city": "Monterrey",
    "stateProvince": "Nuevo León",
    "country": "Mexico",
    "continent": "America"
  },

  "comment": "The app is easy to use and the catalog is good."
}
```

### Decisión de diseño

Se mantiene como colección separada porque un cliente puede generar muchos comentarios con el tiempo.

Si todos los comentarios se embebieran dentro de `customers`, el documento del cliente podría crecer demasiado.

### Relación

La referencia va de `customerFeedback` hacia `customers`.

```txt
customerFeedback -> customers
```

Ejemplo:

```json
{
  "customer": "ObjectId"
}
```

No se guarda un arreglo de feedback dentro de `customers` porque podría crecer demasiado.

---

## 8. Colección `userSessions`

La colección `userSessions` representa sesiones de uso de los clientes.

### Estructura propuesta

```json
{
  "_id": "ObjectId",
  "sessionId": 501,
  "customer": "ObjectId",
  "customerId": 1001,
  "startTime": "2026-05-12T20:00:00",
  "endTime": "2026-05-12T20:45:00",
  "elapsedTime": 45
}
```

### Decisión de diseño

Se mantiene como colección separada porque las sesiones son eventos repetitivos.

Un cliente puede tener muchas sesiones. Si se embebieran todas dentro de `customers`, el documento podría crecer mucho y volverse incómodo de consultar o actualizar.

### Relación

La referencia va de `userSessions` hacia `customers`.

```txt
userSessions -> customers
```

No se guarda una lista de sesiones dentro del cliente.

---

## 9. Colección `activities`

La colección `activities` registra acciones realizadas por los clientes dentro de la plataforma.

Ejemplos de actividades:

```txt
view
watch
rating
pause
search
```

### Estructura propuesta

```json
{
  "_id": "ObjectId",

  "customer": "ObjectId",
  "movie": "ObjectId",
  "genre": "ObjectId",

  "customerId": 1001,
  "movieId": 101,
  "genreId": 1,

  "activity": "watch",
  "rating": 4,
  "activityTime": "2026-05-12T20:30:00",

  "device": {
    "os": "iOS",
    "app": "Mobile",
    "device": "iPhone"
  }
}
```

### Decisión de diseño

Se mantiene como colección separada porque representa eventos de uso.

Las actividades pueden crecer mucho más que las entidades principales. Un cliente puede tener miles de actividades, y una película puede tener miles de reproducciones o ratings.

### Relaciones

`activities` referencia a:

```txt
activities -> customers
activities -> movies
activities -> genres
```

No se referencia en ambas direcciones. Ni `customers` ni `movies` guardan un arreglo de actividades, porque eso haría que sus documentos crecieran demasiado.

### Ventaja

Permite consultar actividad por cliente, película, género o fecha.

Ejemplo:

```js
db.activities.find({ customerId: 1001 })
```

### Desventaja

Para mostrar el nombre del cliente, título de película o nombre del género se necesita usar `populate()` o agregaciones con `$lookup`.

---

## 10. Colección `custSales`

La colección `custSales` representa compras, rentas o transacciones asociadas a clientes, películas y géneros.

### Estructura propuesta

```json
{
  "_id": "ObjectId",

  "day": "2026-05-12",

  "customer": "ObjectId",
  "movie": "ObjectId",
  "genre": "ObjectId",

  "customerId": 1001,
  "movieId": 101,
  "genreId": 1,

  "platform": {
    "app": "Web",
    "device": "Laptop",
    "os": "Windows"
  },

  "payment": {
    "method": "Credit Card",
    "listPrice": 5.99,
    "discountType": "Promotion",
    "discountPercent": 20,
    "actualPrice": 4.79
  }
}
```

### Decisión de diseño

Se mantiene como colección separada porque las ventas son transacciones.

Un cliente puede tener muchas ventas y una película puede aparecer en muchas ventas. Por eso no conviene embeber ventas dentro de `customers` ni dentro de `movies`.

### Relaciones

La dirección de referencias es:

```txt
custSales -> customers
custSales -> movies
custSales -> genres
```

No se referencia en ambas direcciones.

### Ventaja

Se pueden consultar ventas por cliente, película, género o fecha.

Ejemplo:

```js
db.custSales.find({ customerId: 1001 })
```

### Desventaja

Para reportes completos con datos del cliente, película y género se requieren agregaciones o `populate()`.

---

## 11. Colección `salesSamples`

La colección `salesSamples` representa datos de ventas de muestra o registros alternativos para pruebas y análisis.

### Estructura propuesta

```json
{
  "_id": "ObjectId",

  "day": "2026-05-12T00:00:00",

  "customer": "ObjectId",
  "movie": "ObjectId",
  "genre": "ObjectId",

  "customerId": 1001,
  "movieId": 101,
  "genreId": 1,

  "platform": {
    "app": "Mobile",
    "device": "Tablet",
    "os": "Android"
  },

  "payment": {
    "method": "Debit Card",
    "listPrice": 4.99,
    "discountType": "Seasonal",
    "discountPercent": 10,
    "actualPrice": 4.49
  },

  "source": "SALES_SAMPLE"
}
```

### Decisión de diseño

`salesSamples` se mantiene como colección separada para distinguir las ventas principales de los datos de muestra o análisis.

Aunque su estructura es similar a `custSales`, separarla permite probar consultas y análisis sin mezclar los datos principales.

### Relaciones

La dirección de referencias es:

```txt
salesSamples -> customers
salesSamples -> movies
salesSamples -> genres
```

### Alternativa considerada

Otra opción sería unir `salesSamples` con `custSales` y agregar un campo `source`.

Ejemplo:

```json
{
  "source": "sample"
}
```

Sin embargo, se decidió mantenerla separada para distinguir claramente su propósito.

---

## 12. Colección `movieStreamChurn`

La colección `movieStreamChurn` representa información analítica para predicción o análisis de abandono de clientes.

Incluye datos del cliente, preferencias por género y métricas agregadas de transacciones, ventas y descuentos.

### Estructura propuesta

```json
{
  "_id": "ObjectId",

  "customer": "ObjectId",
  "customerId": 1001,

  "isChurner": false,

  "customerSnapshot": {
    "firstName": "Andrea",
    "lastName": "López",
    "email": "andrea@example.com",
    "age": 26,
    "city": "Monterrey",
    "gender": "F",
    "education": "Bachelor",
    "householdSize": 3,
    "incomeLevel": "Medium",
    "jobType": "Engineer",
    "maritalStatus": "Single",
    "creditBalance": 1500,
    "yearsCustomer": 2,
    "yearsResidence": 3,
    "location": {
      "lat": 25.6866,
      "long": -100.3161
    }
  },

  "genreScores": {
    "action": 3,
    "adventure": 2,
    "animation": 1,
    "biography": 0,
    "comedy": 4,
    "crime": 1,
    "documentary": 0,
    "drama": 5,
    "family": 2,
    "fantasy": 1,
    "filmNoir": 0,
    "history": 0,
    "horror": 2,
    "musical": 0,
    "mystery": 1,
    "news": 0,
    "realityTv": 0,
    "romance": 3,
    "sciFi": 4,
    "sport": 0,
    "thriller": 3,
    "war": 0,
    "western": 0
  },

  "transactionAggregates": {
    "numTransactionsM3": 12,
    "numTransactionsM4": 10,
    "numTransactionsM5": 8,
    "numTransactionsM6": 6,
    "salesM3": 59.99,
    "salesM4": 49.99,
    "salesM5": 39.99,
    "salesM6": 29.99
  },

  "discountMetrics": {
    "avgDiscountM3": 10,
    "avgDiscountM3To11": 12,
    "avgDiscountM3To5": 8,
    "discountPctDiffM3To5M6To11": 4,
    "discountPctDiffM3To5M6To8": 3
  },

  "salesMetrics": {
    "avgTransactionsM3To5": 10,
    "avgSalesM3To5": 49.99,
    "salesPctDiffM3To5M6To8": -15,
    "transactionsPctDiffM3To5M6To8": -20
  }
}
```

### Decisión de diseño

`movieStreamChurn` se mantiene como colección separada porque representa datos analíticos, no datos operacionales normales.

No se embebe dentro de `customers`, porque contiene métricas derivadas y una foto del cliente en cierto momento.

### Relación

La dirección de la referencia es:

```txt
movieStreamChurn -> customers
```

También se mantiene `customerSnapshot`.

### ¿Por qué mantener un snapshot?

Porque en un análisis de churn puede ser importante conservar los valores usados en el análisis aunque después el cliente cambie en `customers`.

### Ventaja

Permite analizar churn sin modificar el documento principal del cliente.

### Desventaja

Duplica parte de la información del cliente, pero esa duplicación es aceptable porque tiene un propósito analítico.

---

## 13. Resumen de decisiones: embeber vs referenciar

| Entidad o relación    | Decisión                                        | Justificación                               |
| --------------------- | ----------------------------------------------- | ------------------------------------------- |
| Cliente - contacto    | Embeber en `customers.contact`                  | Es información propia del cliente           |
| Cliente - demografía  | Embeber en `customers.demographics`             | Se consulta como parte del perfil           |
| Cliente - segmento    | Embeber en `customers.segment`                  | Es un dato descriptivo del cliente          |
| Cliente - encuesta    | Embeber en `customers.survey`                   | Es información cercana al perfil            |
| Película - género     | Referenciar de `movies` a `genres`              | Un género puede estar en muchas películas   |
| Película - actor      | Referenciar de `movies` a `actors`              | Un actor puede aparecer en muchas películas |
| Cliente - feedback    | Referenciar de `customerFeedback` a `customers` | El feedback puede crecer con el tiempo      |
| Cliente - sesiones    | Referenciar de `userSessions` a `customers`     | Las sesiones son eventos repetitivos        |
| Cliente - actividades | Referenciar de `activities` a `customers`       | Las actividades pueden crecer mucho         |
| Actividad - película  | Referenciar de `activities` a `movies`          | Una actividad ocurre sobre una película     |
| Actividad - género    | Referenciar de `activities` a `genres`          | Permite analizar actividad por género       |
| Venta - cliente       | Referenciar de `custSales` a `customers`        | Una venta pertenece a un cliente            |
| Venta - película      | Referenciar de `custSales` a `movies`           | Una venta está asociada a una película      |
| Venta - género        | Referenciar de `custSales` a `genres`           | Permite reportes por género                 |
| Churn - cliente       | Referenciar de `movieStreamChurn` a `customers` | El análisis pertenece a un cliente          |

---

## 14. ¿Se referencia en ambas direcciones?

En general, no.

La mayoría de las relaciones se guardan en una sola dirección para evitar duplicar información y evitar inconsistencias.

Por ejemplo:

```txt
movies -> genres
```

pero no:

```txt
genres -> movies
```

Esto significa que la película guarda los géneros, pero el género no guarda una lista de películas.

La excepción parcial es `movieStreamChurn`, donde se guarda una referencia al cliente y también un snapshot con datos del cliente. Esto no se hace para navegar la relación en ambas direcciones, sino para conservar una foto analítica del cliente al momento del cálculo.

---

## 15. Consultas que se vuelven más fáciles

### Consultar perfil completo de cliente

Como los datos principales del cliente están embebidos, se puede consultar todo el perfil con una sola operación.

```js
db.customers.findOne({ customerId: 1001 })
```

### Consultar películas con datos ricos

Cada película contiene sus datos principales, datos comerciales, premios, nominaciones y crew en un solo documento.

```js
db.movies.findOne({ movieId: 101 })
```

### Consultar actividades por cliente

Como las actividades tienen `customerId` y referencia a `customers`, se pueden consultar fácilmente.

```js
db.activities.find({ customerId: 1001 })
```

### Consultar ventas por cliente

```js
db.custSales.find({ customerId: 1001 })
```

### Consultar churn por cliente

```js
db.movieStreamChurn.findOne({ customerId: 1001 })
```

### Consultar películas por género

```js
db.movies.find({ genres: ObjectId("...") })
```

---

## 16. Consultas que se vuelven más difíciles

### Reportes completos de ventas

Para mostrar una venta junto con el nombre del cliente, título de película y nombre del género, se necesitan referencias y agregaciones.

En SQL esto normalmente se resolvería con joins. En MongoDB se puede hacer con `$lookup` o con `populate()` si se usa Mongoose.

### Borrar un género

Si se elimina un género, hay que revisar o limpiar referencias en varias colecciones:

```txt
movies
activities
custSales
salesSamples
```

Ejemplo:

```js
await Movie.updateMany(
  { genres: genreId },
  { $pull: { genres: genreId } }
)

await Activity.updateMany(
  { genre: genreId },
  { $unset: { genre: "" } }
)

await CustSale.updateMany(
  { genre: genreId },
  { $unset: { genre: "" } }
)

await SalesSample.updateMany(
  { genre: genreId },
  { $unset: { genre: "" } }
)
```

### Consultar todos los datos relacionados a una película

Para ver una película junto con actividades, ventas y muestras de ventas, se necesitan varias consultas o una agregación.

### Sincronizar snapshots analíticos

`movieStreamChurn` guarda una copia de datos del cliente en `customerSnapshot`. Si el cliente cambia en `customers`, ese snapshot no cambia automáticamente.

Esto es aceptable porque el snapshot representa una foto histórica o analítica.

---

## 17. Colecciones usadas para la aplicación CRUD

Para la aplicación web simple se implementará CRUD sobre:

1. `movies`
2. `genres`

La colección `movies` tiene relaciones con `genres` y `actors`, por lo que permite demostrar cómo se manejan relaciones en MongoDB.

### Operaciones sobre `movies`

* Listar películas
* Buscar películas por título
* Crear película
* Editar película
* Eliminar película
* Seleccionar géneros relacionados
* Seleccionar actores relacionados

### Operaciones sobre `genres`

* Listar géneros
* Crear género
* Editar género
* Eliminar género

---

## 18. Conclusión del modelo

El modelo documental de MovieStream usa una estrategia mixta.

Se embebe información cuando pertenece naturalmente a una entidad principal, como ocurre con los datos de contacto, demografía, segmento y encuesta del cliente.

Se usan referencias cuando una entidad puede relacionarse con muchas otras o cuando los datos pueden crecer demasiado, como ocurre con películas, géneros, actores, actividades, sesiones, ventas y churn.

El resultado final es un modelo con 10 colecciones que mantiene documentos principales claros y evita crear documentos demasiado grandes.
