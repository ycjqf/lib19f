import { FC } from "react";
import {
  Editor,
  rootCtx,
  editorViewOptionsCtx,
  defaultValueCtx,
  themeFactory,
} from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { ReactEditor, useEditor } from "@milkdown/react";
import { gfm } from "@milkdown/preset-gfm";
import { commonmark } from "@milkdown/preset-commonmark";
import { blockquote, SupportedKeys } from "@milkdown/preset-gfm";
import { history } from "@milkdown/plugin-history";
import { emoji } from "@milkdown/plugin-emoji";
import { listener, listenerCtx } from "@milkdown/plugin-listener";

export default function C(props: {
  onMarkdownUpdated?: (newMarkdown: string) => void;
  defaultText: string;
  editable: boolean;
}) {
  const nodes = commonmark.configure(blockquote, {
    keymap: {
      [SupportedKeys.Blockquote]: "Mod-Shift-b",
    },
  });
  const editor = useEditor(root =>
    Editor.make()
      .config(ctx => {
        ctx.set(rootCtx, root);
        ctx.set(editorViewOptionsCtx, { editable: () => props.editable });
        ctx.set(defaultValueCtx, props.defaultText);
        const { onMarkdownUpdated } = props;
        if (typeof onMarkdownUpdated !== "undefined") {
          ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
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
