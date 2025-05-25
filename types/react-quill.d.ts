declare module 'react-quill' {
  import React from 'react';
  
  interface ReactQuillProps {
    value: string;
    onChange: (value: string) => void;
    theme?: string;
    modules?: any;
    formats?: string[];
    className?: string;
    [key: string]: any;
  }
  
  const ReactQuill: React.FC<ReactQuillProps>;
  export default ReactQuill;
} 