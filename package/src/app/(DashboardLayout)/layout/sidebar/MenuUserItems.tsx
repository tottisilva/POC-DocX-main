import { IconLayoutDashboard } from "@tabler/icons-react";
import SchoolIcon from '@mui/icons-material/School';

import { uniqueId } from "lodash";

const MenuUseritems = [
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
];

export default MenuUseritems;
