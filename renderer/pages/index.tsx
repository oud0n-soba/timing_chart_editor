
import { useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

import { Button } from "@mui/material"
import { LinkButton } from "../components/LinkButton"
import ModalComponent from "./ModalComponent";

const IndexPage = () => {

  useEffect(() => {
    const handleMessage = (_event, args) => alert(args);

    // listen to the 'message' channel
    window.electron.receiveHello(handleMessage);

    return () => {
      window.electron.stopReceivingHello(handleMessage);
    };
  }, []);

  const onSayHiClick = () => {
    window.electron.sayHello();
  };

  return (
    <Layout title="Home | Timing chart editor">
      <h1>Hello Next.js 👋</h1>
      <Button onClick={onSayHiClick}>Say hi to electron</Button>
      <p>
        <Link href="/about">About</Link>
      </p>
      <LinkButton href="/editor">
        RESTORE
      </LinkButton>
      <LinkButton href="/editor">
        NEW CREATE
      </LinkButton>
      <ModalComponent buttonLabel="Open Modal" />
    </Layout>
  );
};

export default IndexPage;
