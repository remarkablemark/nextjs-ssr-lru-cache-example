# Next.js SSR LRU Cache Example

Next.js server-side rendering (SSR) least-recently-used (LRU) cache example inspired by the [Gist](https://gist.github.com/leanazulyoro/23c6581fb4379ec311e3bc8538715687).

## Prerequisites

- [Node.js](https://nodejs.org/)

## Demo

- [Replit](https://replit.com/@remarkablemark/Nextjs-SSR-Cache-using-LRU-Cache)

## Install

Clone the repository:

```sh
git clone https://github.com/remarkablemark/nextjs-ssr-lru-cache-example.git
cd nextjs-ssr-lru-cache-example
```

Install the dependencies:

```sh
npm install
```

## Run

Start the Express server on port 3000:

```sh
npm run server
```

When the page is requested for the first time, the HTML will be rendered and cached based on the LRU policy. When the page is requested again, the cached HTML will be returned in the response.
