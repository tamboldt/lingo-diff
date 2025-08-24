import React, { useState, useRef, useEffect } from 'react';
import '../styles/richTextEditor.css';

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
      setHasRichContent(true);
      
      if (isRichMode && richEditorRef.current) {
        // In rich mode: paste as HTML and retain formatting
        e.preventDefault();
        
        // Insert HTML at cursor position
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = htmlData;
          const fragment = document.createDocumentFragment();
          
          while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
          }
          
          range.insertNode(fragment);
          
          // Move cursor to end of inserted content
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        handleRichEditorChange();
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

  // Handle key press to fix Enter key behavior
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Create a single line break
        const br = document.createElement('br');
        range.deleteContents();
        range.insertNode(br);
        
        // Move cursor after the line break
        range.setStartAfter(br);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        handleRichEditorChange();
      }
    }
  };

  // Format text functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleRichEditorChange();
  };

  // Sync plain text to rich editor when switching modes
  useEffect(() => {
    if (isRichMode && richEditorRef.current && !hasRichContent) {
      richEditorRef.current.innerText = value;
    }
  }, [isRichMode, value, hasRichContent]);

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
            className="rich-text-editor h-[120px] p-3 border border-t-0 border-gray-300 rounded-b-md focus:border-indigo-500 focus:ring-indigo-500 overflow-y-auto font-mono text-sm"
            style={{ height: '120px' }}
            onInput={handleRichEditorChange}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
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
            className="mt-1 block w-full h-[120px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm font-mono py-3 px-4 pr-20 resize-none"
            style={{ height: '120px' }}
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