export { SITE_URL, MAIN_CATEGORIES, OPTIONAL_CATEGORIES } from './llms-shared';

export const INTRO = `Gatekeeper is a standalone credential-injecting TLS-intercepting proxy. Route HTTPS \
traffic through Gatekeeper and it transparently injects authentication headers based on \
hostname matching — clients never see raw credentials. Pluggable credential sources cover \
environment variables, static values, host commands, AWS Secrets Manager, GCP Secret Manager, \
GCP service account tokens, GitHub App tokens, and RFC 8693 token exchange. Includes an MCP \
relay, a Postgres data plane, LLM policy evaluation, network policy enforcement, and \
OpenTelemetry observability. Open source, actively developed.`;
