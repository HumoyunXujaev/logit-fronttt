import TelegramBot from 'node-telegram-bot-api';

// Singleton pattern for the Telegram bot instance
class TelegramBotService {
  private static instance: TelegramBotService;
  private bot: TelegramBot | null = null;
  private webAppUrl: string;
  private token: string;
  private isInitialized = false;

  private constructor() {
    // Initialize with environment variables
    this.token = process.env.TELEGRAM_BOT_TOKEN || '';
    this.webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || '';

    // Log configuration status without exposing sensitive data
    if (!this.token) {
      console.error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables'
      );
    }

    if (!this.webAppUrl) {
      console.error(
        'NEXT_PUBLIC_WEB_APP_URL is not defined in environment variables'
      );
    }
  }

  public static getInstance(): TelegramBotService {
    if (!TelegramBotService.instance) {
      TelegramBotService.instance = new TelegramBotService();
    }
    return TelegramBotService.instance;
  }

  public startBot(): TelegramBot | null {
    // Only initialize if not already initialized
    if (this.isInitialized) {
      return this.bot;
    }

    // Only start the bot in server environment with valid configuration
    if (typeof window === 'undefined' && this.token && this.webAppUrl) {
      try {
        // Create a new bot instance with polling
        this.bot = new TelegramBot(this.token, { polling: true });

        // Setup message handlers
        this.setupMessageHandlers();

        this.isInitialized = true;
        console.log('Telegram bot started successfully');
        return this.bot;
      } catch (error) {
        console.error('Failed to start Telegram bot:', error);
        return null;
      }
    } else {
      // Log specific reason for not starting the bot
      if (typeof window !== 'undefined') {
        console.log('Bot not started: Running in browser environment');
      } else if (!this.token) {
        console.error('Bot not started: Missing TELEGRAM_BOT_TOKEN');
      } else if (!this.webAppUrl) {
        console.error('Bot not started: Missing NEXT_PUBLIC_WEB_APP_URL');
      }
      return null;
    }
  }

  public getBot(): TelegramBot | null {
    return this.bot;
  }

  private setupMessageHandlers(): void {
    if (!this.bot) return;

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (text === '/start') {
        try {
          await this.bot?.sendMessage(chatId, 'Заходите в наш Logit Smartbot', {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Logit Smartbot', web_app: { url: this.webAppUrl } }],
              ],
            },
          });
          console.log(`Start message sent to ${chatId}`);
        } catch (error: any) {
          if (error.response && error.response.statusCode === 403) {
            console.log(`User ${chatId} has blocked the bot`);
            // Handle the blocked user case (e.g., remove from active users list)
          } else {
            console.error('Error sending message:', error);
          }
        }
      }
    });

    // Set up error handler for the bot
    this.bot.on('polling_error', (error) => {
      console.error('Telegram polling error:', error);
    });
  }

  // Method to send a message to a specific chat
  public async sendMessage(
    chatId: number | string,
    text: string,
    options?: any
  ): Promise<any> {
    if (!this.bot) {
      console.error('Bot is not initialized');
      return null;
    }

    try {
      return await this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  // Method to stop the bot (useful for graceful shutdown)
  public stopBot(): void {
    if (this.bot) {
      this.bot.stopPolling();
      this.isInitialized = false;
      console.log('Telegram bot stopped');
    }
  }
}

// Export the singleton instance
export const telegramBotService = TelegramBotService.getInstance();

// Export the bot directly for convenience
export default telegramBotService;
