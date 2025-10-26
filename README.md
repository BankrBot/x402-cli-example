# Bankr x402 CLI Example

A command-line interface example demonstrating how to use the Bankr SDK with x402 payments. This example shows how to interact with the Bankr AI agent for DeFi operations using USDC micropayments.

## Features

- 🤖 Interactive CLI for Bankr AI agent
- 💰 x402 USDC payment integration
- 🔐 Secure wallet management
- 📊 Real-time feedback with loading indicators
- 🎨 Beautiful terminal UI with colors

## Prerequisites

- [Bun](https://bun.sh) runtime installed
- USDC on Base network for payments
- Private key for payment wallet

## Installation

```bash
# Clone the repository
git clone https://github.com/BankrBot/x402-cli-example.git
cd x402-cli-example

# Install dependencies
bun install
```

## Configuration

1. Copy the example environment file:
```bash
cp .env-example .env
```

2. Edit `.env` and add your configuration:
```env
# Required: Payment wallet private key for x402 USDC payments
PRIVATE_KEY=0xYourPrivateKeyHere

# Optional: Context wallet for Bankr prompts and transactions
# If not provided, defaults to the address derived from PRIVATE_KEY
WALLET_ADDRESS=

# Optional: Enable debug mode to see full JSON responses
DEBUG=false
```

## Usage

Run the CLI:
```bash
bun start
```

Follow the interactive prompts to:
- Enter prompts for the Bankr AI agent
- View responses and estimated costs
- Confirm and execute transactions
- Monitor operation status

## Example Interactions

```
What would you like to ask Bankr? Check my wallet balance
```

The CLI will display:
- Estimated cost in USDC
- AI response with action plan
- Transaction confirmation
- Real-time status updates

## How It Works

This example demonstrates the complete flow of using Bankr SDK with x402:

1. **Initialize SDK** - Connect to Bankr API with x402 payment support
2. **Send Prompt** - Submit user queries to the AI agent
3. **Payment Flow** - Handle USDC micropayments via x402
4. **Execute Actions** - Confirm and execute blockchain transactions
5. **Track Status** - Monitor transaction and operation completion

## x402 Payment Protocol

x402 is a payment protocol that enables micropayments for API calls. This example uses it to pay for:
- AI prompt processing
- Transaction facilitation
- Real-time status updates

Payments are made in USDC on Base network, typically ranging from $0.01-0.10 per request.

## Dependencies

- `viem` - Ethereum library for wallet operations
- `ora` - Terminal spinner for loading states
- `chalk` - Terminal string styling
- `dotenv` - Environment variable management

## Learn More

- [Bankr Documentation](https://docs.bankr.fun)
- [x402 Protocol](https://github.com/coinbase/x402)
- [Base Network](https://base.org)

## Security Notes

- Never commit your `.env` file or private keys
- Keep your private key secure
- Start with small amounts for testing
- Use a separate wallet for testing

## License

MIT

