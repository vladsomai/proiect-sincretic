import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className='font-sans m-0 p-0'>
        <Head />
        <body className=" bg-gray-800 text-white">
          <Main/>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument