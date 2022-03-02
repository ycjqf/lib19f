import { Editor, rootCtx, editorViewOptionsCtx, defaultValueCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { ReactEditor, useEditor } from "@milkdown/react";
import { gfm, blockquote, SupportedKeys } from "@milkdown/preset-gfm";
import { commonmark } from "@milkdown/preset-commonmark";
import { history } from "@milkdown/plugin-history";
import { emoji } from "@milkdown/plugin-emoji";
import { listener, listenerCtx } from "@milkdown/plugin-listener";

type Props = {
  onMarkdownUpdated?: (newMarkdown: string) => void;
  defaultText: string;
  editable: boolean;
};
export default function C({ onMarkdownUpdated, defaultText, editable }: Props) {
  const nodes = commonmark.configure(blockquote, {
    keymap: {
      [SupportedKeys.Blockquote]: "Mod-Shift-b",
    },
  });
  const editor = useEditor(root =>
    Editor.make()
      .config(ctx => {
        ctx.set(rootCtx, root);
        ctx.set(editorViewOptionsCtx, { editable: () => editable });
        ctx.set(defaultValueCtx, defaultText);
        if (typeof onMarkdownUpdated !== "undefined") {
          ctx.get(listenerCtx).markdownUpdated((updatedCtx, markdown) => {
            onMarkdownUpdated(markdown);
          });
        }
      })
      .use(nord)
      .use(gfm)
      .use(commonmark)
      .use(nodes)
      .use(emoji)
      .use(listener)
      .use(history)
  );

  return <ReactEditor editor={editor} />;
}
