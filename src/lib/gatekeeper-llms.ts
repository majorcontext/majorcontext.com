export { SITE_URL, MAIN_CATEGORIES, OPTIONAL_CATEGORIES } from './llms-shared';

export const INTRO = `Gatekeeper is a standalone credential-injecting TLS-intercepting proxy. Route HTTPS \
traffic through Gatekeeper and it transparently injects authentication headers based on \
hostname matching — clients never see raw credentials. Pluggable credential sources cover \
environment variables, static values, AWS Secrets Manager, GCP Secret Manager, GitHub App \
tokens, and RFC 8693 token exchange. Includes an MCP relay, network policy enforcement, \
and OpenTelemetry observability. Open source, actively developed.`;
