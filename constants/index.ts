import { SidebarLink } from "@/types";
import {
  Briefcase,
  HelpCircle,
  Home,
  Laptop2,
  Moon,
  Star,
  Sun,
  Tag,
  User,
  Users,
} from "lucide-react";

export const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop2 },
];

export const sidebarLinks: SidebarLink[] = [
  {
    route: "/",
    label: "Home",
    icon: Home,
  },
  {
    route: "/community",
    label: "Community",
    icon: Users,
  },
  {
    route: "/collection",
    label: "Collections",
    icon: Star,
  },
  {
    route: "/jobs",
    label: "Find Jobs",
    icon: Briefcase,
  },
  {
    route: "/tags",
    label: "Tags",
    icon: Tag,
  },
  {
    route: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    route: "/ask-question",
    label: "Ask a question",
    icon: HelpCircle,
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
