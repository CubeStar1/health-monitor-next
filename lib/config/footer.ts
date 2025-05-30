export interface FooterLink {
  href: string
  label: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface FooterConfig {
  brand: {
    title: string
    description: string
  }
  sections: FooterSection[]
  copyright: string
}

export const footerConfig: FooterConfig = {
  brand: {
    title: "NextJS Template",
    description: "NextJS Template"
  },
  sections: [
    {
      title: "Product",
      links: [
        { href: "#", label: "Browser Extension" },
        { href: "#", label: "Admin Dashboard" },
        { href: "#", label: "AI Detection" },
        { href: "#", label: "Pricing Plans" }
      ]
    },
    {
      title: "Solutions",
      links: [
        { href: "#", label: "Universities" },
        { href: "#", label: "Schools" },
        { href: "#", label: "Training Centers" },
        { href: "#", label: "Enterprises" }
      ]
    },
    {
      title: "Resources",
      links: [
        { href: "#", label: "Documentation" },
        { href: "#", label: "API Reference" },
        { href: "#", label: "Help Center" },
        { href: "#", label: "Security" }
      ]
    },
    {
      title: "Legal",
      links: [
        { href: "#", label: "Privacy Policy" },
        { href: "#", label: "Terms of Service" },
        { href: "#", label: "Cookie Policy" },
        { href: "#", label: "GDPR" }
      ]
    }
  ],
  copyright: `© ${new Date().getFullYear()} NextJS Template. All rights reserved.`
}
