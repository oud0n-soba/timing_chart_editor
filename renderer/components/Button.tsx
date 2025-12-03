
import { Button as MUIButton } from "@mui/material";
import { useRouter } from 'next/router';

export const Button = ({ children, onClick }) => {
  const router = useRouter();

  return (
    <MUIButton onClick={onClick}>
      {children}
    </MUIButton>
  )
}