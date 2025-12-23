import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

import { Button } from "../../components/Button";

type Props = {
  children: ReactNode;
  title?: string;
};

const handleSave = async (
  nameData: NameData[],
  signalType: SignalType[],
  chartData: ChartData[][]
) => {
  const data = {
    nameData,
    signalType,
    chartData,
  };
  try {
    const result = await (window as any).electron.saveJson(data);
    if (result.success) {
      // setStatus("保存しました");
    } else if (result.error) {
      // setStatus(`保存に失敗しました: ${result.error}`);
    }
  } catch (e) {
    console.error(e);
    // setStatus("保存エラー");
  }
};

const handleLoad = async () => {
  try {
    const result = await (window as any).electron.loadJson();
    if (result.success && result.data) {
      const validatedChartData = result.data.chartData.map(
        (row: ChartData[]) => {
          if (row.length === 0 || row[row.length - 1] !== "") {
            return [...row, ""];
          }
          return row;
        }
      );

      // setNameData(result.data.nameData);
      // setSignalType(result.data.signalType);
      // setChartData(validatedChartData);
      // setStatus("読み込みました");
      return {
        nameData: result.data.nameData,
        signalType: result.data.signalType,
        chartData: validatedChartData,
      };
    } else if (result.error) {
      // setStatus(`読み込みに失敗しました: ${result.error}`);
    }
  } catch (e) {
    console.error(e);
    // setStatus("読み込みエラー");
  }
  // If loading fails or there's an error, return a default/empty structure
  return {
    nameData: [],
    signalType: [],
    chartData: [],
  };
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div
    style={{
      margin: "0px 5px",
    }}
  >
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        {/* <Link href="/">Home</Link> | <Link href="/about">About</Link> |{" "} */}
        {/* <Link href="/initial-props">With Initial Props</Link> */}
        <div
          style={{
            // marginBottom: "10px",
            // marginRight: "10px",
            // marginLeft: "10px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            backgroundColor: "#333",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            // margin: "10px ",
          }}
        >
          Timing Chart Editor
          <Button
            onClick={handleSave}
            style={{
              marginLeft: "auto",
              padding: "8px 14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#28a745",
              color: "white",
              cursor: "pointer",
            }}
          >
            Save JSON
          </Button>
          <Button
            // onClick={handleLoad}
            style={{
              marginRight: "20px",
              padding: "8px 14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#17a2b8",
              color: "white",
              cursor: "pointer",
            }}
          >
            Load JSON
          </Button>
        </div>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      {/* <span>I'm here to stay (Footer)</span> */}
      <span>https://github.com/oud0n-soba/timing_chart_editor</span>
    </footer>
  </div>
);

export default Layout;
