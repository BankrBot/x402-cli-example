# Bankr x402 CLI Example

A command-line interface example demonstrating how to use the Bankr SDK with x402 payments. This example shows how to interact with the Bankr AI agent for DeFi operations using USDC micropayments.

## Features

- 🤖 Interactive CLI for Bankr AI agent
- 💰 x402 USDC payment integration
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

## x402 Payment Protocol

x402 is a payment protocol that enables micropayments for API calls. This example uses it to pay for:

- Interacting with Bankr

Payments are made in USDC on Base network, $0.10 per request.

## Learn More

- [Bankr SDK](https://www.npmjs.com/package/@bankr/sdk)
- [x402 Protocol](https://github.com/coinbase/x402)
- [Base Network](https://base.org)

## License

MIT
