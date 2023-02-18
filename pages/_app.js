import Head from 'next/head'
import '@/styles/globals.scss'
import { WindowProvider } from '@/components/window-context/window-context';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />

            </Head>
            <WindowProvider>
                <Component {...pageProps} />
            </WindowProvider>
        </>
    )
}