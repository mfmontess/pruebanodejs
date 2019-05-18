# PruebaNodeJS

Ejecución de prueba para uso de Node.js

## Dependencias
- Descargar [mongodb](https://www.mongodb.com/)

- Instalación del módulo mongobd para el proyecto de node.js
- Instalación del módulo querystring para el proyecto de node.js


## Con instalar módulos en Node.js

- Abrir una consola o terminal (dependiendo del Sistema Operativo)
- Ubicarse en la carpeta del proyecto (directorio donde se ubique el archivo package.json)
- Ejecutar el comando

```bash
npm install module
```

###### Argumento
- `module`: Nombre del módulo a instalar.

## Ejecución del proyecto

- Clonar el proyecto descargando archivo zip
- Descomprimir zip
- Abrir una consola o terminal (dependiendo del Sistema Operativo)
- Ubicarse en la carpeta del proyecto (directorio donde se ubique el archivo package.json)
- Ejecutar el comando

```bash
npm start
```

- Por defecto está definida para la ejecución la url [127.0.0.1:3000](http://127.0.0.1:3000)

### Nota
Si se requiere modificar está url ir al archivo [../proyecto/index.js](https://github.com/mfmontess/pruebanodejs/blob/master/proyecto/index.js) y modificar las constantes hostname y port
###### Ejemplo
```js
const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
const urlMongo = "mongodb://localhost:27017/";
const hostname = '127.0.0.1';
const port = 8080
  ```
