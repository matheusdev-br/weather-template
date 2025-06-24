import React from 'react';
import type { Note } from '../models/types';

interface NoteManageProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  selectedNoteId: string | null;
}

const NoteManage: React.FC<NoteManageProps> = ({ notes, onSelectNote, onAddNote, onDeleteNote, selectedNoteId }) => {
  return (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderBottom: '1px solid #ccc' }}> 
            <h2>Minhas Notas</h2>
            <button onClick={onAddNote}>+</button>
        </div>
        <ul>
            {notes.map(note => (
            <li key={note.id} style={{ marginBottom: '8px', fontWeight: note.id === selectedNoteId ? 'bold' : 'normal' }}>
                <span onClick={() => onSelectNote(note.id)} style={{ cursor: 'pointer' }}>
                {note.title || 'Nota sem título'}
                </span>
                <button onClick={() => onDeleteNote(note.id)} style={{ marginLeft: '10px' }}>Excluir</button>
            </li>
            ))}
        </ul>
    </div>
  );
};

export default NoteManage;