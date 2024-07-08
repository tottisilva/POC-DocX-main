import Link from "next/link";
import { Box, styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Box py={2}>
        <Image src="/images/logos/LogoDLX.png" alt="logo" height={42} width={180} priority />
      </Box>
    </LinkStyled>
  );
};

export default Logo;
