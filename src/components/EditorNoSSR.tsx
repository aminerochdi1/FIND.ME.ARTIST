import dynamic from 'next/dynamic';

const EditorWithNoSSR = 
dynamic(() => {
  return import('./Editor');
}, {
  ssr: false,
});

export default EditorWithNoSSR;