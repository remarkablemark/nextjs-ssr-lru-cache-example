import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js SSR Cache using LRU Cache</title>
      </Head>

      <main>
        <h1>Welcome to Next.js SSR Cache using LRU Cache!</h1>
        <a
          href="https://github.com/remarkablemark/nextjs-ssr-lru-cache-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </main>
    </>
  );
}
