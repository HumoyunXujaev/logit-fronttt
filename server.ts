// Load environment variables first before importing other modules
import * as dotenv from 'dotenv';
// Load from .env.local and fallback to .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import telegramBotService from './lib/telegram-bot';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Validate critical environment variables
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error(
    'ERROR: TELEGRAM_BOT_TOKEN is required. Please set it in .env.local or .env file.'
  );
}

if (!process.env.NEXT_PUBLIC_WEB_APP_URL) {
  console.error(
    'ERROR: NEXT_PUBLIC_WEB_APP_URL is required. Please set it in .env.local or .env file.'
  );
}

// Initialize the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Start the Telegram bot only if we're not in development or if explicitly enabled
  const shouldStartBot =
    process.env.NODE_ENV !== 'development' ||
    process.env.ENABLE_TELEGRAM_BOT === 'true';

  if (shouldStartBot) {
    console.log('Starting Telegram bot...');
    const bot = telegramBotService.startBot();

    if (bot) {
      console.log('Telegram bot started successfully');
    } else {
      console.error('Failed to start Telegram bot');
    }
  } else {
    console.log('Telegram bot not started (development mode)');
  }

  // Create the HTTP server
  createServer(async (req: any, res: any) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
    .once('error', (err: any) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });

  // Set up graceful shutdown
  const shutdownGracefully = () => {
    console.log('Shutting down gracefully...');
    telegramBotService.stopBot();
    process.exit(0);
  };

  // Handle termination signals
  process.on('SIGTERM', shutdownGracefully);
  process.on('SIGINT', shutdownGracefully);
});
