import { NextResponse } from 'next/server';
import { telegramBotService } from '@/lib/telegram-bot';

// Initialize the bot on first API call if conditions are met
let botInitialized = false;
const initializeBot = () => {
  // Only initialize once
  if (botInitialized) return;

  // Only start the bot in production or if explicitly enabled
  if (
    process.env.NODE_ENV !== 'development' ||
    process.env.ENABLE_TELEGRAM_BOT === 'true'
  ) {
    console.log('Initializing Telegram bot from API route...');
    telegramBotService.startBot();
    botInitialized = true;
  }
};

// GET endpoint to check bot status
export async function GET() {
  initializeBot();

  const bot = telegramBotService.getBot();

  if (!bot) {
    // Return more specific error information
    const errorReason = !process.env.TELEGRAM_BOT_TOKEN
      ? 'Missing TELEGRAM_BOT_TOKEN environment variable'
      : !process.env.NEXT_PUBLIC_WEB_APP_URL
      ? 'Missing NEXT_PUBLIC_WEB_APP_URL environment variable'
      : 'Telegram bot not initialized';

    return NextResponse.json(
      { error: errorReason, status: 'error' },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: 'Telegram bot is running' });
}

// POST endpoint to send messages
export async function POST(request: Request) {
  try {
    // Initialize bot if not already done
    initializeBot();

    const bot = telegramBotService.getBot();

    if (!bot) {
      return NextResponse.json(
        { error: 'Telegram bot not initialized' },
        { status: 500 }
      );
    }

    // Parse request data
    const data = await request.json();
    const { chatId, message, options } = data;

    // Validate required parameters
    if (!chatId) {
      return NextResponse.json(
        { error: 'Missing required parameter: chatId' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Missing required parameter: message' },
        { status: 400 }
      );
    }

    // Send message
    const result = await telegramBotService.sendMessage(
      chatId,
      message,
      options
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Return success response with message details
    return NextResponse.json({
      success: true,
      messageId: result.message_id,
      chatId: result.chat.id,
      date: result.date,
    });
  } catch (error: any) {
    console.error('Error in POST /api/telegram:', error);

    // Return more detailed error information
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Unknown error',
        status: 'error',
      },
      { status: 500 }
    );
  }
}
