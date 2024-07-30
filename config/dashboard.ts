import { DashboardConfig } from "types"
export const dashboardConfig: DashboardConfig = {
  mainNav: [],
  sidebarNav: [
    // {
    //   title: "Defendants",
    //   href: "/defendants",
    //   icon: "hamer1",
    //   access: ["DIRECTOR","COORDINATOR"],
    //   header:"HOME"
    // },
    {
      title: "Defendants",
      href: "/viewdefendant",
      icon: "PiUserFocus",
      access: ["DIRECTOR","COORDINATOR","VIEWER"],
      header:"HOME"
    },

   {
      title: "Contacts",
      href: "/contacts",
      icon: "PiIdentificationCard",
      access: ["DIRECTOR","COORDINATOR","VIEWER"],
      header:"LOOKUP"
    },
    {
      title: "Cases",
      href: "/cases",
      icon: "PiBooks",
      access: ["DIRECTOR","COORDINATOR","VIEWER"],
      header:"LOOKUP"
    },
    {
      title: "Notes/Events",
      href: "/notes",
      icon: "PiNote",
      access: ["DIRECTOR","COORDINATOR","VIEWER"],
      header:"LOOKUP"
    },
    {
      title: "Codes",
      href: "/codes",
      icon: "PiListChecks",
      access: ["DIRECTOR","COORDINATOR","VIEWER"],
      header:"LOOKUP"
    },
    {
      title: "Code Types",
      href: "/codetypes",
      icon: "PiRowsPlusBottom",
      access: ["DIRECTOR","COORDINATOR","VIEWER"],
      header:"LOOKUP"
    },
    {
      title: "Prisons",
      href: "/prison",
      icon: "PiAirTrafficControl",
      access: ["DIRECTOR","COORDINATOR","VIEWER"],
      header:"LOOKUP"
    },
    {
      title: "Users",
      href: "/user",
      icon: "PiUsers",
      access: ["DIRECTOR","COORDINATOR"],
      header:"ADMIN"
    },
    // {
    //   title: "Lookup Management",
    //   href: "",
    //   icon: "settings",
    //   linkPrefix: "lookup",
    //   access: ["DIRECTOR"],
    //   subMenu: [
    //     {
    //       title: "Encounter Type",
    //       href: "/lookup/encountertype",
    //       icon: "settings",
    //       access: ["PAYER", "PROFESSIONAL", "DIRECTOR"],
    //     },
    //   ],
    // },

    // {
    //   title: "Reports",
    //   href: "",
    //   icon: "post",
    //   linkPrefix: "reports",
    //   access: ["PROFESSIONAL", "DIRECTOR"],
    //   subMenu: [
    //     {
    //       title: "Billing",
    //       href: "/reports/billing",
    //       icon: "settings",
    //       access: ["PAYER", "PROFESSIONAL", "DIRECTOR"],
    //     },
    //   ],
    // },
  ],
  accessControl: {
    "/defendants": ["DIRECTOR","COORDINATOR","VIEWER"],
    "/viewdefendant": ["DIRECTOR","COORDINATOR","VIEWER"],
    "/codes":["DIRECTOR","COORDINATOR","VIEWER"],
    "/codetypes":["DIRECTOR","COORDINATOR","VIEWER"],
    "/notes":["DIRECTOR","COORDINATOR","VIEWER"],
    "/user":["DIRECTOR","COORDINATOR"],
    "/profile":["DIRECTOR"],
    "/prison":["DIRECTOR","COORDINATOR","VIEWER"],
    "/cases":["DIRECTOR","COORDINATOR","VIEWER"],
    "/contacts":["DIRECTOR","COORDINATOR","VIEWER"],
  },
}
