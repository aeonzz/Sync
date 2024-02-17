import home from "@/public/icons/home.svg";
import haha from "@/public/icons/haha.svg";
import megaphone from "@/public/icons/megaphone.svg";
import events from "@/public/icons/events.svg";
import bird from "@/public/icons/bird.svg";
import homeSecondary from "@/public/icons/home-secondary.svg";
import eventsSecondary from "@/public/icons/events-secondary.svg";
import megaphoneSecondary from "@/public/icons/megaphone-secondary.svg";
import birdSecondary from "@/public/icons/bird-secondary.svg";
import bell from "@/public/icons/bell.svg";
import bellSecondary from "@/public/icons/bell-secondary.svg";


export const postTabsNav = [
  {
    href: '/',
    title: 'home',
    tooltip: 'home',
    icon: home,
  },
  {
    href: '/events',
    title: 'event',
    tooltip: 'events',
    icon: events,
  },
  {
    href: '/announcements',
    title: 'announcements',
    tooltip: 'announcements',
    icon: megaphone,
  }
]

export const sidebarNav = [
  {
    title: "Home",
    icon: home,
    active: homeSecondary,
    link: "/home",
    alt: 'home'
  },
  {
    title: "Event",
    icon: events,
    active: eventsSecondary,
    link: "/events",
    alt: 'events'
  },
  {
    title: "Announcement",
    icon: megaphone,
    active: megaphoneSecondary,
    link: "/announcements",
    alt: "announcements"
  },
  {
    title: "Freedom Wall",
    icon: bird,
    active: birdSecondary,
    link: "/freedom-wall",
    alt: "freedom-wall"
  },
  // {
  //   title: "Notifications",
  //   icon: bell,
  //   active: bellSecondary,
  //   link: "/notifications",
  //   alt: "notifications"
  // },
]

export const adminNav = [
  {
    title: "Overview",
    link: "/admin",
  },
]

export const sidebarNavItems = [
  {
    title: "Profile",
    href: "/user/profile",
  },
  {
    title: "Account",
    href: "/user/account",
  },
  {
    title: "Appearance",
    href: "/examples/forms/appearance",
  },
  {
    title: "Notifications",
    href: "/examples/forms/notifications",
  },
  {
    title: "Display",
    href: "/examples/forms/display",
  },
]

export const departments = [
  {
    title: "None",
    value: "None",
  },
  {
    title: "Information Technology",
    value: "BSIT",
  },
  {
    title: "Energy Systems and Management",
    value: "BSESM"
  },
  {
    title: "Naval Architecture and Marine Engineering",
    value: "BSNAME"
  },
  {
    title: "Mechanical Engineering Technology",
    value: "BSMET"
  },
  {
    title: "Technology Communication Management",
    value: "BSTCM"
  }
]