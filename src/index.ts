import { config } from "dotenv";
import { BankrClient } from "@bankr/sdk";
import ora from "ora";
import chalk from "chalk";
import { createInterface } from "readline/promises";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

// Load environment variables
config();

// Validate required env vars
if (!process.env.PRIVATE_KEY) {
  console.error(chalk.red("Missing PRIVATE_KEY in .env"));
  process.exit(1);
}

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
const derivedAccount = privateKeyToAccount(privateKey);
const walletAddress = process.env.WALLET_ADDRESS || derivedAccount.address;
const debug = process.env.DEBUG === "true";

// Debug logging function
const log = (...args: any[]) => {
  if (debug) {
    console.log(...args);
  }
};

// Initialize Bankr client
const client = new BankrClient({
  privateKey,
  walletAddress,
});

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Orange chalk
const orange = chalk.hex("#FFA028");

// Viem wallet client for tx execution (using same private key for demo)
const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

const banner = `
*~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~*
                                                                 
██████╗  █████╗ ███╗   ██╗██╗  ██╗██████╗      ██████╗██╗     ██╗
██╔══██╗██╔══██╗████╗  ██║██║ ██╔╝██╔══██╗    ██╔════╝██║     ██║
██████╔╝███████║██╔██╗ ██║█████╔╝ ██████╔╝    ██║     ██║     ██║
██╔══██╗██╔══██║██║╚██╗██║██╔═██╗ ██╔══██╗    ██║     ██║     ██║
██████╔╝██║  ██║██║ ╚████║██║  ██╗██║  ██║    ╚██████╗███████╗██║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝     ╚═════╝╚══════╝╚═╝
                                                                 
Your Friendly AI-Powered Crypto Banker                           
SDK Demo Powered by x402
*~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~**~*~*
    `;

async function main() {
  console.log(orange(banner));

  // Add unhandled promise rejection handler
  process.on("unhandledRejection", (reason, promise) => {
    console.error(chalk.red("Unhandled Promise Rejection:"), reason);
    console.error(chalk.red("At promise:"), promise);
    console.error(
      chalk.red("Stack trace:"),
      reason instanceof Error ? reason.stack : "No stack trace",
    );
  });

  // Add uncaught exception handler
  process.on("uncaughtException", (error) => {
    console.error(chalk.red("Uncaught Exception:"), error);
    console.error(chalk.red("Stack trace:"), error.stack);
    process.exit(1);
  });

  // Add process exit handler
  process.on("exit", (code) => {
    log(chalk.yellow(`Process exiting with code: ${code}`));
  });

  // Keep-alive mechanism to prevent process from exiting
  const keepAlive = setInterval(() => {
    // This keeps the event loop active
  }, 1000);

  // Add process beforeExit handler
  process.on("beforeExit", (code) => {
    log(chalk.yellow(`Process beforeExit with code: ${code}`));
    log(chalk.yellow("This should not happen - keeping process alive"));
    // Don't let the process exit - keep it alive
    if (code === 0) {
      log(chalk.yellow("Preventing exit - process should stay alive"));
      // The process will stay alive as long as readline is active
    }
  });

  // Add signal handlers to catch process termination
  process.on("SIGINT", () => {
    console.log(chalk.yellow("\nReceived SIGINT - cleaning up..."));
    clearInterval(keepAlive);
    rl.close();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log(chalk.yellow("\nReceived SIGTERM - cleaning up..."));
    clearInterval(keepAlive);
    rl.close();
    process.exit(0);
  });

  // Add readline error handler
  rl.on("error", (error) => {
    console.error(chalk.red("Readline error:"), error);
    console.error(
      chalk.red("Stack trace:"),
      error instanceof Error ? error.stack : "No stack trace",
    );
  });

  rl.on("close", () => {
    log(chalk.yellow("Readline interface closed"));
    log(chalk.yellow("This will cause the program to exit"));
  });

  // Use async iterator approach instead of event-driven
  let isProcessing = false;

  const processInput = async (input: string) => {
    if (isProcessing) {
      console.log(chalk.yellow("Please wait, processing previous request..."));
      return;
    }

    isProcessing = true;
    log(chalk.gray(`[DEBUG] Received prompt: "${input}"`));

    if (input.toLowerCase() === "exit") {
      log(chalk.gray(`[DEBUG] Exit command received`));
      clearInterval(keepAlive);
      rl.close();
      console.log(orange("Goodbye!"));
      process.exit(0);
    }

    const spinner = ora({
      text: "Processing your request...",
      discardStdin: false,
      stream: process.stderr,
    }).start();
    try {
      log(
        chalk.gray(
          `[DEBUG] Calling client.promptAndWait with prompt: "${input}"`,
        ),
      );
      log(
        chalk.gray(`[DEBUG] Readline closed before client call: ${rl.closed}`),
      );

      const result = await client.promptAndWait({ prompt: input });
      log(chalk.gray(`[DEBUG] client.promptAndWait completed successfully`));
      log(
        chalk.gray(`[DEBUG] Readline closed after client call: ${rl.closed}`),
      );

      spinner.succeed("Response received");

      // Display main response
      if (result.response) {
        console.log(orange(result.response));
      } else {
        console.log(orange("No response text available."));
      }

      // Handle rich data (e.g., image links)
      const responseText = result.response?.toLowerCase() ?? "";
      const imageRegex = /(https?:\/\/.*\.(?:png|jpg|gif))/gi;
      const images = responseText.match(imageRegex);
      if (images) {
        console.log(orange("\nImage links:"));
        images.forEach((img) => console.log(orange(`- ${img}`)));
      }

      // Debug mode: show full JSON
      log(chalk.gray("\nDebug JSON:"));
      log(chalk.gray(JSON.stringify(result, null, 2)));

      // Handle transactions
      if (result.transactions && result.transactions.length > 0) {
        console.log(orange("\nTransactions available to execute:"));
        for (const [index, tx] of result.transactions.entries()) {
          console.log(orange(`\nTransaction ${index + 1}:`));
          console.log(orange(JSON.stringify(tx.metadata, null, 2)));

          // For now, skip transaction execution in async iterator mode
          // This would need a more complex state machine to handle
          console.log(
            orange("Transaction execution skipped in async iterator mode"),
          );
        }
      }
    } catch (error) {
      spinner.fail("Error processing request");
      console.error(chalk.red("Error in client.promptAndWait:"));
      console.error(
        chalk.red(error instanceof Error ? error.message : String(error)),
      );
      console.error(
        chalk.red("Stack trace:"),
        error instanceof Error ? error.stack : "No stack trace",
      );
    } finally {
      isProcessing = false;
      log(
        chalk.gray(
          `[DEBUG] Finished processing, readline closed: ${rl.closed}`,
        ),
      );
    }
  };

  rl.setPrompt(orange("Enter your prompt: "));
  rl.prompt();

  try {
    for await (const line of rl) {
      if (!line.trim()) {
        rl.prompt();
        continue;
      }
      await processInput(line);
      rl.prompt();
    }
  } catch (error) {
    console.error(chalk.red("Error in async iterator:"));
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error)),
    );
  }
}

main().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(errorMessage));
  process.exit(1);
});
