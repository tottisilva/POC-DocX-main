import PeopleIcon from '@mui/icons-material/People';
import Person from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ListIcon from '@mui/icons-material/List';
import { IconLayoutDashboard } from '@tabler/icons-react';
import FolderIcon from '@mui/icons-material/Folder';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Home",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Trainings",
  },
  {
    id: uniqueId(),
    title: "Trainings",
    icon: SchoolIcon,
    href: "/Trainings",
  },
  {
    id: uniqueId(),
    title: "Training Type",
    icon: ListIcon,
    href: "/TrainingTypes",
  },
  {
    navlabel: true,
    subheader: "Documents",
  },
  {
    id: uniqueId(),
    title: "Documents",
    icon: FolderIcon,
    href: "/Documents",
  },
  {
    id: uniqueId(),
    title: "Functional Areas",
    icon: SettingsIcon,
    href: "/FunctionalAreas",
  },
  {
    id: uniqueId(),
    title: "Group Names",
    icon: GroupsIcon,
    href: "/GroupNames",
  },
  {
    navlabel: true,
    subheader: "Users",
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: Person,
    href: "/Users/",
  },
  {
    id: uniqueId(),
    title: "Roles",
    icon: PeopleIcon,
    href: "/Roles/",
  },
];

export default Menuitems;
