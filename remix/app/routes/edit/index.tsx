import { useEffect, useState } from "react";

const markdown = `Just a link: https://reactjs.com.`;

export default function Edit() {
  //   const [editor, setEditor] = useState<JSX.Element>(<div>Loading...</div>);
  //   const GetEditor = async () => {
  //     // @ts-ignore
  //     const { default: ReactMarkdown } = await import("react-markdown");
  //     // @ts-ignore
  //     const { default: remarkGfm } = await import("remark-gfm");
  //     // @ts-ignore
  //     return <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />;
  //   };

  //   useEffect(() => {
  //     GetEditor().then(r => {
  //       console.log(r);
  //       // @ts-ignore
  //       setEditor(r);
  //     });
  //   }, []);

  return (
    <div>
      <h1>Edit</h1>
    </div>
  );
}
