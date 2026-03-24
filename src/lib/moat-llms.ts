export { SITE_URL, MAIN_CATEGORIES, OPTIONAL_CATEGORIES } from './llms-shared';

export const INTRO = `Moat is a CLI tool for running AI coding agents (Claude Code, Codex, etc.) in isolated \
Docker or Apple containers. Credentials (GitHub tokens, API keys, SSH keys) are injected \
at the network layer via a TLS-intercepting proxy—never in environment variables. Every \
run captures logs, HTTP traces, and a tamper-proof audit log. Configuration lives in \
\`moat.yaml\`. Open source, actively developed.`;
