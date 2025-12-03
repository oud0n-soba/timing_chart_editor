
import * as React from "react";
import { useContext } from "react";

import { AppProps } from 'next/app'
import Head from 'next/head'


export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}