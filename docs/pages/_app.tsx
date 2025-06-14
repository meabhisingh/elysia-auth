import * as React from "react";
import "../styles/globals.css";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
