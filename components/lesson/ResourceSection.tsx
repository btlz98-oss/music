import React, { useState } from 'react';
import { Youtube, Link as LinkIcon, Plus, Trash2, ExternalLink } from 'lucide-react';

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
}

interface ResourceSectionProps {
  links: ResourceLink[];
  onLinksChange: (links: ResourceLink[]) => void;
}

export const ResourceSection: React.FC<ResourceSectionProps> = ({ links, onLinksChange }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addLink = () => {
    if (!newTitle || !newUrl) return;
    const newLink: ResourceLink = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`
    };
    onLinksChange([...links, newLink]);
    setNewTitle('');
    setNewUrl('');
  };

  const removeLink = (id: string) => {
    onLinksChange(links.filter(l => l.id !== id));
  };

  return (
    <div className="bg-sky-50 p-5 rounded-2xl border border-sky-200 shadow-sm print:hidden">
      <h3 className="font-bold text-sky-800 flex items-center gap-2 mb-3">
        <Youtube size={20} /> 참고 영상 및 음원
      </h3>
      
      <div className="space-y-3 mb-4">
        {links.map(link => (
          <div key={link.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-sky-100 shadow-sm group">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-700 hover:text-sky-900 font-medium truncate flex-1">
              {link.url.includes('youtube') || link.url.includes('youtu.be') ? <Youtube size={16} className="text-red-500" /> : <LinkIcon size={16} />}
              {link.title} <ExternalLink size={12} className="opacity-50" />
            </a>
            <button onClick={() => removeLink(link.id)} className="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {links.length === 0 && <p className="text-sm text-sky-400 italic">저장된 링크가 없습니다.</p>}
      </div>

      <div className="flex gap-2 items-center bg-white p-2 rounded-lg border border-sky-200">
        <input 
          type="text" 
          placeholder="제목 (예: 봄비 소리)" 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 p-2 text-sm outline-none bg-transparent"
        />
        <div className="w-px h-6 bg-sky-200"></div>
        <input 
          type="text" 
          placeholder="URL 주소" 
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 p-2 text-sm outline-none bg-transparent"
        />
        <button onClick={addLink} className="p-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 disabled:opacity-50" disabled={!newTitle || !newUrl}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};