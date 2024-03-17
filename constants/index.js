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
    link: "/event",
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
]

export const adminNav = [
  {
    title: "Overview",
    link: "/admin",
  },
]

export const profileNav = [
  {
    title: "Profile",
    link: "/u",
  },
  {
    title: "Account",
    link: "/user/account",
  },
  {
    title: "Appearance",
    link: "/examples/forms/appearance",
  },
  {
    title: "Notifications",
    link: "/examples/forms/notifications",
  },
  {
    title: "Display",
    link: "/examples/forms/display",
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