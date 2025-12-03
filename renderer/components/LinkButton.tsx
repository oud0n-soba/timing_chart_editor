
import { Button } from "./Button";
import { useRouter } from 'next/router';

export const LinkButton = ({ children, href }) => {
  const router = useRouter();

  const handleClick = (e) => {
    router.push(href);
  }

  return (
    <Button onClick={handleClick}>
      {children}
    </Button>
  )
}