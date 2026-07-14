import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Video,
  Grid,
  Sparkles,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }),
      Youtube.configure({ width: 480, height: 320 }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Set initial content if it changes (e.g. on load edit)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Masukkan URL Gambar:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("Masukkan URL Link:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt("Masukkan URL YouTube Video:");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      
      {/* Editor Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        
        {/* Bold */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </Button>

        {/* Italic */}
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </Button>

        {/* Underline */}
        <Button
          type="button"
          variant={editor.isActive("underline") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={15} />
        </Button>

        {/* Highlight */}
        <Button
          type="button"
          variant={editor.isActive("highlight") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Sparkles size={15} />
        </Button>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 align-middle self-center" />

        {/* Heading 1 */}
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={15} />
        </Button>

        {/* Heading 2 */}
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </Button>

        {/* Heading 3 */}
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={15} />
        </Button>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 align-middle self-center" />

        {/* Bullet List */}
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </Button>

        {/* Ordered List */}
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </Button>

        {/* Quote */}
        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </Button>

        {/* Code Block */}
        <Button
          type="button"
          variant={editor.isActive("codeBlock") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code size={15} />
        </Button>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 align-middle self-center" />

        {/* Add Link */}
        <Button
          type="button"
          variant={editor.isActive("link") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={addLink}
        >
          <LinkIcon size={15} />
        </Button>

        {/* Add Image */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={addImage}
        >
          <ImageIcon size={15} />
        </Button>

        {/* Add YouTube */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={addYoutube}
        >
          <Video size={15} />
        </Button>

        {/* Add Table */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={addTable}
        >
          <Grid size={15} />
        </Button>

        {/* Horizontal Rule */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={15} />
        </Button>

      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[300px] text-left prose prose-sm max-w-none prose-slate dark:prose-invert">
        <EditorContent editor={editor} className="outline-none" />
      </div>

    </div>
  );
};
