// Importamos las dependencias necesarias
const express = require('express');
const firebaseAdmin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Inicializamos Firebase con las credenciales de la variable de entorno
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = firebaseAdmin.firestore();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Ruta para servir apple-app-site-association con el header correcto
app.get('/.well-known/apple-app-site-association', (req, res) => {
  const filePath = path.join(__dirname, '.well-known', 'apple-app-site-association');
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Archivo AASA no encontrado');
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'application/json');
  res.send(fileContent);
});

// Endpoint para generar deep links
app.get('/api/generate', async (req, res) => {
  const { linkId } = req.query;

  // Recuperamos los enlaces desde la base de datos de Firebase
  const linkDoc = await db.collection('deepLinks').doc(linkId).get();

  if (!linkDoc.exists) {
    return res.status(404).send('Link no encontrado');
  }

  const deepLink = linkDoc.data().url; // 'url' es el campo que contiene el deep link

  if (deepLink) {
    res.redirect(deepLink);  // Redirige al enlace profundo en la app
  } else {
    res.status(404).send('Link no encontrado');
  }
});

// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
