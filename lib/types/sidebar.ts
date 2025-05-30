export interface SidebarItem {
  title: string;
  href: string;
  icon: any;
  description?: string;
}

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
  collapsible?: boolean;
  icon?: any;
  collapsibleTitle?: string;
}

export interface SidebarConfig {
  brand: {
    title: string;
    icon: any;
    href: string;
  };
  sections: SidebarSection[];
}
