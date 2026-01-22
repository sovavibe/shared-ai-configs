import chalk from 'chalk';

export const logger = {
  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message);
  },

  success: (message: string) => {
    console.log(chalk.green('✓'), message);
  },

  warn: (message: string) => {
    console.log(chalk.yellow('⚠'), message);
  },

  error: (message: string) => {
    console.log(chalk.red('✗'), message);
  },

  debug: (message: string) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray('⚙'), message);
    }
  },

  header: (message: string) => {
    console.log();
    console.log(chalk.bold.cyan(message));
    console.log(chalk.gray('─'.repeat(50)));
  },

  table: (data: Record<string, string>) => {
    const maxKeyLen = Math.max(...Object.keys(data).map(k => k.length));
    for (const [key, value] of Object.entries(data)) {
      console.log(`  ${chalk.gray(key.padEnd(maxKeyLen))}  ${value}`);
    }
  },

  list: (items: string[], prefix = '•') => {
    for (const item of items) {
      console.log(`  ${chalk.gray(prefix)} ${item}`);
    }
  }
};
