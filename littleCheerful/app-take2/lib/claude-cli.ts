import { spawn } from 'child_process';

export interface ClaudeCliOptions {
  command: string;
  args?: string[];
  cwd?: string;
  timeout?: number;
}

export interface StreamChunk {
  type: 'stdout' | 'stderr' | 'error' | 'done';
  data: string;
}

/**
 * Execute Claude CLI command and return output
 */
export async function executeClaudeCli(options: ClaudeCliOptions): Promise<string> {
  const {
    command,
    args = [],
    cwd = process.env.CLAUDE_BASE_PATH || process.cwd(),
    timeout = parseInt(process.env.DEFAULT_TIMEOUT_SECONDS || '120') * 1000,
  } = options;

  return new Promise((resolve, reject) => {
    const cliPath = process.env.CLAUDE_CLI_PATH || 'claude';
    const fullArgs = [command, ...args];

    const proc = spawn(cliPath, fullArgs, {
      cwd,
      shell: true,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    let timeoutId: NodeJS.Timeout;

    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        proc.kill('SIGTERM');
        reject(new Error(`Claude CLI command timed out after ${timeout}ms`));
      }, timeout);
    }

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('error', (error) => {
      clearTimeout(timeoutId);
      reject(new Error(`Failed to spawn Claude CLI: ${error.message}`));
    });

    proc.on('close', (code) => {
      clearTimeout(timeoutId);
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Claude CLI exited with code ${code}: ${stderr}`));
      }
    });
  });
}

/**
 * Stream Claude CLI output using AsyncGenerator
 */
export async function* streamClaudeCli(options: ClaudeCliOptions): AsyncGenerator<StreamChunk> {
  const {
    command,
    args = [],
    cwd = process.env.CLAUDE_BASE_PATH || process.cwd(),
    timeout = parseInt(process.env.DEFAULT_TIMEOUT_SECONDS || '120') * 1000,
  } = options;

  const cliPath = process.env.CLAUDE_CLI_PATH || 'claude';
  const fullArgs = [command, ...args];

  const proc = spawn(cliPath, fullArgs, {
    cwd,
    shell: true,
    windowsHide: true,
  });

  let timeoutId: NodeJS.Timeout | undefined;

  if (timeout > 0) {
    timeoutId = setTimeout(() => {
      proc.kill('SIGTERM');
    }, timeout);
  }

  // Yield stdout chunks
  for await (const chunk of proc.stdout) {
    yield {
      type: 'stdout',
      data: chunk.toString(),
    };
  }

  // Yield stderr chunks
  for await (const chunk of proc.stderr) {
    yield {
      type: 'stderr',
      data: chunk.toString(),
    };
  }

  // Wait for process to close
  const exitCode = await new Promise<number>((resolve) => {
    proc.on('close', (code) => {
      if (timeoutId) clearTimeout(timeoutId);
      resolve(code || 0);
    });
  });

  if (exitCode !== 0) {
    yield {
      type: 'error',
      data: `Process exited with code ${exitCode}`,
    };
  }

  yield {
    type: 'done',
    data: '',
  };
}
