export const SITE_URL = 'https://majorcontext.com';

export const MAIN_CATEGORIES = ['getting-started', 'concepts', 'guides'] as const;
export const OPTIONAL_CATEGORIES = ['reference'] as const;

export const INTRO = `Moat is a CLI tool for running AI coding agents (Claude Code, Codex, etc.) in isolated \
Docker or Apple containers. Credentials (GitHub tokens, API keys, SSH keys) are injected \
at the network layer via a TLS-intercepting proxy—never in environment variables. Every \
run captures logs, HTTP traces, and a tamper-proof audit log. Configuration lives in \
\`agent.yaml\`. Open source, actively developed.`;
