// Importamos las dependencias necesarias
const express = require('express');
const firebaseAdmin = require('firebase-admin');
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

// Simulamos una base de datos de enlaces profundos en Firebase
// Puedes agregar más enlaces profundos en la base de datos de Firebase
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
