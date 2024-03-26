import home from "@/public/icons/home.svg";
import megaphone from "@/public/icons/megaphone.svg";
import events from "@/public/icons/events.svg";
import bird from "@/public/icons/bird.svg";
import highlights from "@/public/icons/highlights.svg"
import explore from "@/public/icons/explore.svg"
import notification from "@/public/icons/notifcation.svg"
import profile from "@/public/icons/profile.svg"

export const sidebarNav = [
  {
    title: "Home",
    icon: home,
    link: "/home",
    alt: "home",
  },
  {
    title: "Highlights",
    icon: highlights,
    link: "/highlights",
    alt: "highlights",
  },
  {
    title: "Explore",
    icon: explore,
    link: "/explore",
    alt: "explore",
  },
  {
    title: "Events",
    icon: events,
    link: "/event",
    alt: "events",
  },
  {
    title: "Notification",
    icon: notification,
    link: "/notification",
    alt: "notification",
  },
  {
    title: "Profile",
    icon: profile,
    link: "/profile",
    alt: "profile",
  },
];

export const adminNav = [
  {
    title: "Overview",
    link: "/admin",
  },
];

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
];

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
    value: "BSESM",
  },
  {
    title: "Naval Architecture and Marine Engineering",
    value: "BSNAME",
  },
  {
    title: "Mechanical Engineering Technology",
    value: "BSMET",
  },
  {
    title: "Technology Communication Management",
    value: "BSTCM",
  },
];
