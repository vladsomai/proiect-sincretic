import Head from "next/head";
import Navbar from "./navbar";
import Footer from "./footer";

const Layout = ({ children }: any) => {
  return (
    <>
      <Head>
        <meta name="Proiect sincretic" content="Proiect" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar />
        <div className="">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
