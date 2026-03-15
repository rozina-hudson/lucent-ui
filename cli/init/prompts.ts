import * as readline from 'node:readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

export interface MenuOption {
  label: string;
  value: string;
  description: string;
}

export async function choose(title: string, options: MenuOption[]): Promise<string> {
  console.log(`\n${title}\n`);
  for (let i = 0; i < options.length; i++) {
    console.log(`  ${i + 1}) ${options[i].label} — ${options[i].description}`);
  }
  console.log();

  while (true) {
    const input = await ask(`  Enter choice (1–${options.length}): `);
    const idx = parseInt(input, 10) - 1;
    if (idx >= 0 && idx < options.length) {
      return options[idx].value;
    }
    console.log(`  Invalid choice. Please enter a number between 1 and ${options.length}.`);
  }
}

export function close(): void {
  rl.close();
}
