import { createApp } from './app';
import { config } from './config/env';

/**
 * Point d'entrée de l'application
 */
const startServer = (): void => {
  const app = createApp();
  const port = config.port;

  app.listen(port, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   Serveur E-Commerce démarré avec succès  ║
╠═══════════════════════════════════════════╣
║   Port: ${port}                            ║
║   Environnement: ${config.nodeEnv}        ║
║   URL: http://localhost:${port}           ║
║   API: http://localhost:${port}/api       ║
╚═══════════════════════════════════════════╝
    `);
  });
};

startServer();
