require('dotenv').config();
const http = require('http')
require("./config/dbConnect")
const app = require("./app/app")
const swaggerUi = require('swagger-ui-express');

 swaggerDocument = require('./swagger.json');

 app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
const PORT=  process.env.PORT || 3000;


// server
const server = http.createServer(app)
server.listen(PORT,console.log(`server is running${PORT}`))
// Yxx9SigqMfyFY2VG