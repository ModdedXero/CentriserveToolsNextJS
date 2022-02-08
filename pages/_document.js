import Document, { Html, Head, Main, NextScript } from "next/document";

class MainDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <script src="https://kit.fontawesome.com/4280a60692.js" crossOrigin="anonymous"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
          {/*Below we add the modal wrapper*/}
          <div id="modalPortal"></div>
          <div id="alertPortal"></div>
        </body>
      </Html>
    );
  }
}

export default MainDocument;