import React from "react";
import Menuitems from "./MenuItems";
import MenuUseritems from "./MenuUserItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { useSession } from "next-auth/react";

interface SidebarItemsProps {
  toggleMobileSidebar: () => void;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ toggleMobileSidebar }) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const { data: session } = useSession();

  if (!session || !session.user.role) {
    // Redirect or handle unauthorized access
    return null;
  }

  const userRole: string = session.user.role;

  const menuItems = userRole === 'User' ? MenuUseritems : Menuitems;

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {menuItems.map((item) => {
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
