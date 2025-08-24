import React, { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  id: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  label,
  id
}) => {
  const [isRichMode, setIsRichMode] = useState(false);
  const [hasRichContent, setHasRichContent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const richEditorRef = useRef<HTMLDivElement>(null);

  // Detect rich content on paste
  const handlePaste = async (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const plainText = clipboardData.getData('text/plain');

    if (htmlData && htmlData.length > plainText.length) {
      // Rich content detected
      e.preventDefault();
      setHasRichContent(true);
      
      if (isRichMode && richEditorRef.current) {
        // In rich mode: paste as HTML
        richEditorRef.current.innerHTML = htmlData;
        onChange(richEditorRef.current.innerText || richEditorRef.current.textContent || '');
      } else {
        // In plain mode: extract plain text but show rich content detected
        onChange(plainText);
      }
    }
  };

  // Handle rich editor changes
  const handleRichEditorChange = () => {
    if (richEditorRef.current) {
      const plainText = richEditorRef.current.innerText || richEditorRef.current.textContent || '';
      onChange(plainText);
    }
  };

  // Format text functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleRichEditorChange();
  };

  // Sync plain text to rich editor when switching modes
  useEffect(() => {
    if (isRichMode && richEditorRef.current) {
      richEditorRef.current.innerText = value;
    }
  }, [isRichMode, value]);

  return (
    <div className="space-y-2">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {hasRichContent && !isRichMode && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Rich content detected
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsRichMode(!isRichMode)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            {isRichMode ? '📝 Plain' : '✨ Rich'}
          </button>
        </div>
      </div>

      {isRichMode ? (
        <>
          {/* Rich Text Toolbar */}
          <div className="flex items-center gap-1 p-2 border border-gray-200 rounded-t-md bg-gray-50">
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="p-1 hover:bg-gray-200 rounded text-sm font-bold"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="p-1 hover:bg-gray-200 rounded text-sm italic"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => formatText('underline')}
              className="p-1 hover:bg-gray-200 rounded text-sm underline"
              title="Underline"
            >
              U
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => formatText('removeFormat')}
              className="p-1 hover:bg-gray-200 rounded text-xs"
              title="Clear Formatting"
            >
              🧹
            </button>
          </div>

          {/* Rich Text Editor */}
          <div
            ref={richEditorRef}
            contentEditable
            className="min-h-[120px] p-3 border border-t-0 border-gray-300 rounded-b-md focus:border-indigo-500 focus:ring-indigo-500 resize-y overflow-auto"
            style={{ minHeight: '120px' }}
            onInput={handleRichEditorChange}
            onPaste={handlePaste}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        </>
      ) : (
        /* Plain Text Editor */
        <div className="relative">
          <textarea
            ref={textareaRef}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm font-mono py-3 px-4 pr-20"
            placeholder={placeholder}
          />
          <div className="absolute bottom-2 right-3 text-xs font-bold text-gray-600 bg-white/80 px-2 py-1 rounded">
            {value.length} characters
          </div>
        </div>
      )}
    </div>
  );
};