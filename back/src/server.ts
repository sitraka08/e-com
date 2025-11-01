import { createApp } from './app';

/**
 * Point d'entrée de l'application
 */
const startServer = (): void => {
  const app = createApp();
  const port = process.env.PORT || 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';

  app.listen(port, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   Serveur E-Commerce démarré avec succès  ║
╠═══════════════════════════════════════════╣
║   Port: ${port}                            ║
║   Environnement: ${nodeEnv}        ║
║   URL: http://localhost:${port}           ║
║   API: http://localhost:${port}/api       ║
╚═══════════════════════════════════════════╝
    `);
  });
};

startServer();
