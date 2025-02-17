const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Base de datos simulada de enlaces profundos
app.get('/api/generate', (req, res) => {
    const { linkId } = req.query;
    
    const deepLinks = {
        'abc123': 'https://tuapp://pagina/artist?id=1',
        'xyz789': 'https://tuapp://pagina/artist?id=2',
    };
    
    const deepLink = deepLinks[linkId];

    if (deepLink) {
        res.redirect(deepLink);  // Redirige a la URL específica en tu app
    } else {
        res.status(404).send('Link no encontrado');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});
