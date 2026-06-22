import { MarkdownContent } from "@/components/MarkdownContent";

type ChapterContentProps = {
  content: string;
};

export function ChapterContent({ content }: ChapterContentProps) {
  return (
    <div className="reader-content-card mx-auto w-full rounded-[1.75rem] bg-transparent px-1 py-6 sm:px-4">
      <MarkdownContent content={content} />
    </div>
  );
}
