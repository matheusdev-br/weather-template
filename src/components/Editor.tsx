import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { Note } from '../models/types';
import { debounce } from '../util/debounceFunc';

interface NoteEditorOpts {
  note: Note;
  onSave: (note: Note) => void;
  characterLimit: number;
}

const Editor: React.FC<NoteEditorOpts> = ({ note, onSave, characterLimit }) => {
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const quillRef = useRef(null);

  useEffect(() => {
    setContent(note.content);
    setTitle(note.title);
  }, [note]);

  const debouncedSave = useRef(
    debounce((newContent: string, newTitle: string) => {
      onSave({ ...note, content: newContent, title: newTitle, lastEdited: Date.now() });
    }, 500)
  ).current;

  const handleChange = (value: string) => {
    const plainTextLength = value.replace(/<[^>]*>/g, '').length;
    if (plainTextLength <= characterLimit) {
      setContent(value);
      debouncedSave(value, title);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(content, newTitle);
  };

  const currentLength = content.replace(/<[^>]*>/g, '').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <input
        type="text"
        placeholder="Título da Nota"
        value={title}
        onChange={handleTitleChange}
        style={{
          width: '100%',
          padding: '8px 10px',
          marginBottom: '10px',
          boxSizing: 'border-box'
        }}
      />
      {}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean']
            ],
          }}
          formats={[
            'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'link', 'image'
          ]}
        />
      </div>
      <p style={{ marginTop: '10px', textAlign: 'right' }}>
        {currentLength}/{characterLimit} caracteres
      </p>
    </div>
  );
};

export default Editor;