import * as React from "react";
import { useContext } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'SourceHanCodeJP-Bold';
    src: url('/fonts/source-han-code-jp/SourceHanCodeJP-Bold.otf');
  }
  @font-face {
    font-family: 'SourceHanCodeJP-Normal';
    src: url('/fonts/source-han-code-jp/SourceHanCodeJP-Normal.otf');
  }
  body {
    font-family: 'SourceHanCodeJP-Normal';
  }
`;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
