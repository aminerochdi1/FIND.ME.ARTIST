
declare namespace JSX {
  interface IntrinsicElements {
    [key: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}