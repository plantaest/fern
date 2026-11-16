import { HydrationScript, type JSX } from '@solidjs/web';

export default function Document(props: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
