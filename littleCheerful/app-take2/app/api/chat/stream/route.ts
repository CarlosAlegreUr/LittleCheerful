import { NextRequest } from 'next/server';
import { streamClaudeCli } from '@/lib/claude-cli';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, goalName, conceptPath, sessionId } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Build command args
          const args = [
            '--message', message,
          ];

          if (goalName) args.push('--goal', goalName);
          if (conceptPath) args.push('--concept', conceptPath);
          if (sessionId) args.push('--session', sessionId);

          // Stream Claude CLI output
          for await (const chunk of streamClaudeCli({
            command: 'chat',
            args,
          })) {
            if (chunk.type === 'stdout') {
              // Send SSE event
              const data = `data: ${JSON.stringify({ content: chunk.data })}\n\n`;
              controller.enqueue(encoder.encode(data));
            } else if (chunk.type === 'error') {
              const data = `data: ${JSON.stringify({ error: chunk.data })}\n\n`;
              controller.enqueue(encoder.encode(data));
            } else if (chunk.type === 'done') {
              const data = `data: ${JSON.stringify({ done: true })}\n\n`;
              controller.enqueue(encoder.encode(data));
              controller.close();
            }
          }
        } catch (error: any) {
          const data = `data: ${JSON.stringify({ error: error.message })}\n\n`;
          controller.enqueue(encoder.encode(data));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
