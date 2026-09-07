import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import {
  UploadCloud,
  Search,
  Trash2,
  Video,
  Image as ImageIcon,
  Maximize2,
} from 'lucide-react';
import type { MediaItem } from '../types';

export const MediaLibrary: React.FC = () => {
  const { mediaItems, addMediaItem, deleteMediaItem } = useAdmin();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

  const filteredMedia = mediaItems.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video');
      const fakeUrl = URL.createObjectURL(file);

      addMediaItem({
        name: file.name,
        url: fakeUrl,
        type: isVideo ? 'video' : 'image',
        size: `${(file.size / 1024).toFixed(0)} KB`,
        dimensions: isVideo ? '1920 x 1080' : '1000 x 1000',
      });

      showToast(`Uploaded "${file.name}" to media library`, 'success');
    }
  };

  const handleDelete = () => {
    if (itemToDelete) {
      deleteMediaItem(itemToDelete.id);
      showToast(`Deleted "${itemToDelete.name}"`, 'success');
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Centralized asset repository for product imagery, campaign videos, and banner graphics"
        breadcrumbs={[{ label: 'Content', href: '/admin/homepage' }, { label: 'Media Library' }]}
        actions={
          <label className="inline-flex items-center justify-center font-medium rounded-lg bg-[#7e14ff] hover:bg-[#6b0ee0] text-white px-3.5 py-2 text-sm gap-2 shadow-xs cursor-pointer transition-colors">
            <UploadCloud className="w-4 h-4" />
            <span>Upload Media</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        }
      />

      <Card>
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets by file name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#7e14ff] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['all', 'image', 'video'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  filterType === t
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All Files' : `${t}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <CardContent className="p-6">
          {filteredMedia.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No media files found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((media) => (
                <div
                  key={media.id}
                  className="group rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-[#7e14ff]/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Thumbnail / Video */}
                  <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                    <img
                      src={media.url}
                      alt={media.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Media type icon tag */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/60 text-white text-[10px] font-bold flex items-center gap-1">
                      {media.type === 'video' ? (
                        <>
                          <Video className="w-3 h-3 text-rose-400" /> Video
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3 text-sky-400" /> Image
                        </>
                      )}
                    </div>

                    {/* Hover action overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreviewItem(media)}
                        className="p-2 rounded-lg bg-white text-slate-800 hover:bg-slate-100 shadow-xs cursor-pointer"
                        title="Preview"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(media)}
                        className="p-2 rounded-lg bg-white text-rose-600 hover:bg-rose-50 shadow-xs cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata info */}
                  <div className="p-3 bg-white border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-800 truncate" title={media.name}>
                      {media.name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{media.size}</span>
                      <span>{media.uploadedDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewItem && (
        <Modal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          title="Media Preview"
          description={previewItem.name}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>Size: {previewItem.size}</span>
                {previewItem.dimensions && <span>Dimensions: {previewItem.dimensions}</span>}
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-1.5 font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[60vh]">
            <img
              src={previewItem.url}
              alt={previewItem.name}
              className="max-h-[55vh] w-auto object-contain"
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {itemToDelete && (
        <ConfirmModal
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Media File?"
          message={`Are you sure you want to delete "${itemToDelete.name}"? Products currently displaying this image might show a placeholder.`}
          confirmText="Delete File"
          isDanger
        />
      )}
    </div>
  );
};
