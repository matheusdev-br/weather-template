import React, { useState, useEffect } from 'react';
import NoteManage from './components/NoteManage';
import Editor from './components/Editor';
import type { Note } from './models/types';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (e) {
      setNotes([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (e) {
    }
  }, [notes, isInitialized]);

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Nova Nota',
      content: '',
      lastEdited: Date.now(),
    };
    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId) || null;

  return (
    <div style={{ display: 'flex', height: '90vh', width: '100%' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <NoteManage notes={notes} onSelectNote={handleSelectNote} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} selectedNoteId={selectedNoteId} />
      </div>
      <div style={{ flexGrow: 1, padding: '10px' }}>
        {selectedNote ? (
          <Editor note={selectedNote} onSave={handleUpdateNote} characterLimit={5000} />
        ) : (
          <p>Selecione uma nota ou crie uma nova.</p>
        )}
      </div>
    </div>
  );
};

export default App;