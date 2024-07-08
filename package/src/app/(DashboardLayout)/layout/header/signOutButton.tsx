import { signOutUser } from "./signOutAction";
import { Button } from "@mui/material";

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        await signOutUser();
      }}
    >
      <Button variant="contained" disableElevation color="primary" type="submit">Sign Out</Button>
    </form>
  );
}
