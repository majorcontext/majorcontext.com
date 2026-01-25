export interface NavItem {
  href: string;
  number: string;
  label: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        href: "/moat/getting-started/introduction",
        number: "01",
        label: "Introduction"
      },
      {
        href: "/moat/getting-started/installation",
        number: "02",
        label: "Installation"
      },
      {
        href: "/moat/getting-started/quick-start",
        number: "03",
        label: "Quick Start"
      },
      {
        href: "/moat/getting-started/comparison",
        number: "04",
        label: "Comparison"
      }
    ]
  },
  {
    title: "Concepts",
    items: [
      {
        href: "/moat/concepts/sandboxing",
        number: "01",
        label: "Sandboxing"
      },
      {
        href: "/moat/concepts/credentials",
        number: "02",
        label: "Credentials"
      },
      {
        href: "/moat/concepts/audit-logs",
        number: "03",
        label: "Audit Logs"
      },
      {
        href: "/moat/concepts/observability",
        number: "04",
        label: "Observability"
      },
      {
        href: "/moat/concepts/networking",
        number: "05",
        label: "Networking"
      },
      {
        href: "/moat/concepts/dependencies",
        number: "06",
        label: "Dependencies"
      }
    ]
  },
  {
    title: "Guides",
    items: [
      {
        href: "/moat/guides/running-claude-code",
        number: "01",
        label: "Claude Code"
      },
      {
        href: "/moat/guides/running-codex",
        number: "02",
        label: "Codex"
      },
      {
        href: "/moat/guides/ssh-access",
        number: "03",
        label: "SSH Access"
      },
      {
        href: "/moat/guides/secrets-management",
        number: "04",
        label: "Secrets"
      },
      {
        href: "/moat/guides/multi-agent",
        number: "05",
        label: "Multi-Agent"
      },
      {
        href: "/moat/guides/snapshots",
        number: "06",
        label: "Snapshots"
      }
    ]
  },
  {
    title: "Reference",
    items: [
      {
        href: "/moat/reference/cli",
        number: "01",
        label: "CLI"
      },
      {
        href: "/moat/reference/agent-yaml",
        number: "02",
        label: "agent.yaml"
      },
      {
        href: "/moat/reference/environment",
        number: "03",
        label: "Environment"
      }
    ]
  }
];
