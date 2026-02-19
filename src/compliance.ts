/**
 * x402 CLI Demo — Compliance check for `--compliance` flag.
 *
 * Usage in CLI: `x402 pay --compliance <merchant_address>`
 *
 * Returns { status, skipped }:
 * - If no SHULAM_API_KEY is set, returns { status: 'clear', skipped: true } with info msg.
 * - If address is blocked, exits with code 1.
 * - If address is held, prints warning but continues.
 * - If address is clear, proceeds silently.
 *
 * Zero external dependencies — raw `fetch` only.
 */

export type ComplianceStatus = 'clear' | 'held' | 'blocked';

export interface ComplianceCheckResult {
  status: ComplianceStatus;
  skipped: boolean;
  matchScore: number;
}

const STATUS_MAP: Record<string, ComplianceStatus> = {
  clear: 'clear',
  held: 'held',
  blocked: 'blocked',
  pending: 'held',
  error: 'held',
};

/**
 * Check compliance status of an address.
 *
 * @param address - Ethereum address to screen
 * @param apiKey - Optional API key (falls back to SHULAM_API_KEY env var)
 * @returns Compliance result with status and whether the check was skipped
 */
export async function checkCompliance(
  address: string,
  apiKey?: string,
): Promise<ComplianceCheckResult> {
  const key = apiKey ?? process.env.SHULAM_API_KEY;
  const baseUrl = process.env.SHULAM_API_URL ?? 'https://api.shulam.xyz';

  if (!key) {
    console.log('ℹ Compliance check skipped (no SHULAM_API_KEY).');
    console.log('  Get a free key at: https://api.shulam.xyz/register');
    return { status: 'clear', skipped: true, matchScore: 0 };
  }

  try {
    const response = await fetch(`${baseUrl}/v1/compliance/screen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': key,
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      console.log(`⚠ Compliance API returned HTTP ${response.status} — treating as skipped.`);
      return { status: 'clear', skipped: true, matchScore: 0 };
    }

    const data = await response.json() as Record<string, unknown>;
    const status = STATUS_MAP[data.status as string] ?? 'held';
    const matchScore = (data.matchScore as number) ?? 0;
    const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

    switch (status) {
      case 'clear':
        console.log(`✓ ${shortAddr} — compliance clear`);
        break;
      case 'held':
        console.log(`⚠ ${shortAddr} — compliance held (match score: ${matchScore.toFixed(2)})`);
        console.log('  Transaction will proceed, but address is under review.');
        break;
      case 'blocked':
        console.error(`✘ ${shortAddr} — compliance BLOCKED (match score: ${matchScore.toFixed(2)})`);
        console.error('  This address is on a sanctions list. Transaction aborted.');
        process.exit(1);
    }

    return { status, skipped: false, matchScore };
  } catch {
    console.log('⚠ Compliance check failed (network error) — treating as skipped.');
    return { status: 'clear', skipped: true, matchScore: 0 };
  }
}
