import { Button as MUIButton } from "@mui/material";
import { useRouter } from "next/router";

export const Button = ({ children, onClick, ...props }: any) => {
  const router = useRouter();

  return (
    <MUIButton onClick={onClick} {...props}>
      {children}
    </MUIButton>
  );
};
