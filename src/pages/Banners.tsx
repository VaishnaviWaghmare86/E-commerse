import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Monitor,
  Smartphone,
  UploadCloud,
  Check,
  X,
  ImageIcon,
  Sparkles,
  Eye,
} from 'lucide-react';
import type { Banner } from '../types';

export const Banners: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner } = useAdmin();
  const { showToast } = useToast();

  // Carousel & Preview State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCtaText, setFormCtaText] = useState('Explore Deals');
  const [formCtaLink, setFormCtaLink] = useState('/collections/festive');
  const [formDesktopImage, setFormDesktopImage] = useState(
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=1200&auto=format&fit=crop&q=80'
  );
  const [formMobileImage, setFormMobileImage] = useState(
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&auto=format&fit=crop&q=80'
  );
  const [desktopImageMode, setDesktopImageMode] = useState<'upload' | 'url'>('upload');
  const [mobileImageMode, setMobileImageMode] = useState<'upload' | 'url'>('upload');
  const [isDesktopDragging, setIsDesktopDragging] = useState(false);
  const [isMobileDragging, setIsMobileDragging] = useState(false);
  const [desktopFileName, setDesktopFileName] = useState('');
  const [mobileFileName, setMobileFileName] = useState('');

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  const [formStartDate, setFormStartDate] = useState('2026-09-01');
  const [formEndDate, setFormEndDate] = useState('2026-09-30');
  const [formStatus, setFormStatus] = useState<'Active' | 'Scheduled' | 'Expired'>('Active');
  const [formSortOrder, setFormSortOrder] = useState(1);

  // Auto-play timer for hero banner carousel
  useEffect(() => {
    if (!isAutoPlay || isHovered || banners.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, banners.length]);

  // Ensure activeSlideIndex stays valid if banners list changes
  useEffect(() => {
    if (activeSlideIndex >= banners.length && banners.length > 0) {
      setActiveSlideIndex(banners.length - 1);
    }
  }, [banners.length, activeSlideIndex]);

  const handlePrevSlide = () => {
    if (banners.length === 0) return;
    setActiveSlideIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNextSlide = () => {
    if (banners.length === 0) return;
    setActiveSlideIndex((prev) => (prev + 1) % banners.length);
  };

  // Image Drag & Drop handlers
  const handleProcessFile = (
    file: File,
    setImage: (val: string) => void,
    setFileName: (val: string) => void
  ) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        setFileName(file.name);
        showToast(`Loaded ${file.name} successfully`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCtaText('Shop Collection');
    setFormCtaLink('/collections/festive');
    setFormDesktopImage(
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=1200&auto=format&fit=crop&q=80'
    );
    setFormMobileImage(
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&auto=format&fit=crop&q=80'
    );
    setDesktopFileName('');
    setMobileFileName('');
    setFormStartDate('2026-09-01');
    setFormEndDate('2026-09-30');
    setFormStatus('Active');
    setFormSortOrder(banners.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setFormTitle(b.title);
    setFormSubtitle(b.subtitle);
    setFormCtaText(b.ctaText);
    setFormCtaLink(b.ctaLink);
    setFormDesktopImage(b.desktopImage);
    setFormMobileImage(b.mobileImage);
    setDesktopFileName('');
    setMobileFileName('');
    setFormStartDate(b.startDate);
    setFormEndDate(b.endDate);
    setFormStatus(b.status);
    setFormSortOrder(b.sortOrder);
    setIsModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Banner title is required', 'error');
      return;
    }

    if (editingBanner) {
      updateBanner(editingBanner.id, {
        title: formTitle,
        subtitle: formSubtitle,
        ctaText: formCtaText,
        ctaLink: formCtaLink,
        desktopImage: formDesktopImage,
        mobileImage: formMobileImage,
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        sortOrder: formSortOrder,
      });
      showToast('Banner updated successfully', 'success');
    } else {
      addBanner({
        title: formTitle,
        subtitle: formSubtitle,
        ctaText: formCtaText,
        ctaLink: formCtaLink,
        desktopImage: formDesktopImage,
        mobileImage: formMobileImage,
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        sortOrder: formSortOrder,
      });
      showToast('New banner created successfully', 'success');
      setActiveSlideIndex(banners.length);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (bannerToDelete) {
      deleteBanner(bannerToDelete.id);
      showToast(`Banner "${bannerToDelete.title}" deleted`, 'success');
      setBannerToDelete(null);
      if (activeSlideIndex > 0) {
        setActiveSlideIndex(activeSlideIndex - 1);
      }
    }
  };

  const currentBanner = banners[activeSlideIndex] || banners[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Banners"
        description="Design, render, and schedule interactive storefront hero carousels and festive sale announcements"
        breadcrumbs={[{ label: 'Marketing', href: '/admin/banners' }, { label: 'Banners' }]}
        actions={
          <Button onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Add Banner
          </Button>
        }
      />

      {/* LIVE STOREFRONT HERO BANNER CAROUSEL & SLIDER PREVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Banner Preview Toolbar */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Storefront Hero Carousel
            </div>
            <span className="hidden sm:inline text-xs text-slate-400">
              Auto-syncs directly to customer home page
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-white text-[#7e14ff] font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Desktop Hero Banner View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (16:9)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-white text-[#7e14ff] font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mobile Responsive Banner View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (Phone)</span>
              </button>
            </div>

            {/* Play / Pause Autoplay */}
            <button
              type="button"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isAutoPlay
                  ? 'bg-purple-50 text-[#7e14ff] border-purple-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={isAutoPlay ? 'Pause Auto Slider' : 'Play Auto Slider'}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isAutoPlay ? 'Auto-slide ON' : 'Paused'}</span>
            </button>
          </div>
        </div>

        {/* Carousel Visual Stage */}
        <div
          className={`p-4 sm:p-6 transition-all duration-300 ${
            previewDevice === 'mobile' ? 'bg-slate-100 flex justify-center py-8' : 'bg-slate-900/5'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {banners.length > 0 && currentBanner ? (
            <div
              className={`relative overflow-hidden transition-all duration-500 ${
                previewDevice === 'desktop'
                  ? 'w-full h-[300px] sm:h-[380px] md:h-[420px] rounded-2xl shadow-xl'
                  : 'w-full max-w-[380px] h-[520px] rounded-[36px] shadow-2xl border-[8px] border-slate-900 bg-slate-950'
              }`}
            >
              {/* Device Notch for Mobile View */}
              {previewDevice === 'mobile' && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-b-xl z-20" />
              )}

              {/* Background Image */}
              <img
                key={currentBanner.id + previewDevice}
                src={
                  previewDevice === 'mobile'
                    ? currentBanner.mobileImage || currentBanner.desktopImage
                    : currentBanner.desktopImage
                }
                alt={currentBanner.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Gradient Dark Overlay for contrast */}
              <div
                className={`absolute inset-0 z-10 ${
                  previewDevice === 'mobile'
                    ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/20 flex flex-col justify-end p-6'
                    : 'bg-gradient-to-r from-black/85 via-black/50 to-transparent flex flex-col justify-center p-8 sm:p-12 md:p-16'
                }`}
              >
                {/* Content Box */}
                <div className="max-w-xl text-white space-y-3 sm:space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-2xs">
                      #{currentBanner.sortOrder} Hero Slide
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        currentBanner.status === 'Active'
                          ? 'bg-emerald-500/90 text-white'
                          : currentBanner.status === 'Scheduled'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-slate-500/90 text-white'
                      }`}
                    >
                      {currentBanner.status}
                    </span>
                    <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {currentBanner.startDate} to {currentBanner.endDate}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2
                    className={`font-black text-white leading-tight tracking-tight drop-shadow-md ${
                      previewDevice === 'mobile' ? 'text-xl' : 'text-2xl sm:text-4xl lg:text-5xl'
                    }`}
                  >
                    {currentBanner.title}
                  </h2>

                  {/* Subtitle */}
                  <p
                    className={`text-slate-200 drop-shadow line-clamp-2 ${
                      previewDevice === 'mobile' ? 'text-xs' : 'text-sm sm:text-base'
                    }`}
                  >
                    {currentBanner.subtitle}
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        showToast(
                          `Simulating storefront navigation to: ${currentBanner.ctaLink}`,
                          'info'
                        )
                      }
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-[#7e14ff] hover:from-violet-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>{currentBanner.ctaText}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(currentBanner)}
                      className="px-3.5 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit This Slide</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Slide Counter & Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeSlideIndex === idx
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/40 hover:bg-white/75'
                    }`}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
                <span className="text-[11px] font-medium text-white/90 ml-1.5 pl-1.5 border-l border-white/30">
                  {activeSlideIndex + 1} / {banners.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#7e14ff] mx-auto flex items-center justify-center mb-3">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Banners Published</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create promotional banners to render a beautiful hero carousel for your storefront.
              </p>
              <Button onClick={openAddModal} className="mt-4" size="sm">
                Add First Banner
              </Button>
            </div>
          )}
        </div>

        {/* Thumbnail Selector Strip */}
        {banners.length > 0 && (
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-3 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 shrink-0 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7e14ff]" />
              Slides:
            </span>
            {banners.map((b, idx) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`relative flex items-center gap-2.5 p-1.5 rounded-xl border transition-all shrink-0 cursor-pointer text-left ${
                  activeSlideIndex === idx
                    ? 'border-[#7e14ff] bg-purple-50/60 shadow-xs ring-2 ring-[#7e14ff]/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <img
                  src={b.desktopImage}
                  alt={b.title}
                  className="w-14 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="pr-2 max-w-[140px]">
                  <p className="text-xs font-bold text-slate-800 truncate">{b.title}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>#{b.sortOrder}</span>
                    <span>•</span>
                    <span className={b.status === 'Active' ? 'text-emerald-600 font-semibold' : ''}>
                      {b.status}
                    </span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* BANNERS MANAGEMENT TABLE */}
      <Card>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">All Scheduled Banners</h3>
            <p className="text-xs text-slate-400">
              Manage banner rankings, active date ranges, and call-to-action endpoints
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">{banners.length} total banners</span>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title & Subtitle</TableHead>
                <TableHead>Call To Action</TableHead>
                <TableHead>Active Dates</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner, idx) => (
                <TableRow
                  key={banner.id}
                  className={activeSlideIndex === idx ? 'bg-purple-50/40' : ''}
                >
                  <TableCell className="w-32">
                    <div className="relative group cursor-pointer" onClick={() => setActiveSlideIndex(idx)}>
                      <img
                        src={banner.desktopImage}
                        alt={banner.title}
                        className={`w-28 h-14 rounded-lg object-cover border shadow-2xs transition-transform group-hover:scale-105 ${
                          activeSlideIndex === idx
                            ? 'border-[#7e14ff] ring-2 ring-[#7e14ff]/30'
                            : 'border-slate-200'
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold gap-1 transition-opacity">
                        <Eye className="w-3 h-3" /> View
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="font-semibold text-slate-900 text-xs block truncate">
                      {banner.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                      {banner.subtitle}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-[#7e14ff] font-medium">
                      <span>{banner.ctaText}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {banner.ctaLink}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {banner.startDate} ~ {banner.endDate}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-slate-700">
                    #{banner.sortOrder}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={banner.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setActiveSlideIndex(idx);
                          openEditModal(banner);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setBannerToDelete(banner)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit Banner Modal with Drag-and-Drop Image Upload */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Banner' : 'Create New Promotional Banner'}
        description="Configure banner visuals with drag & drop, call-to-action buttons, and schedule windows"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button size="sm" onClick={handleSaveBanner}>
              {editingBanner ? 'Save Changes' : 'Create Banner'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveBanner} className="space-y-4 max-h-[72vh] overflow-y-auto pr-1">
          <Input
            label="Banner Headline *"
            placeholder="e.g. Autumn Toy Fest - Flat 40% OFF"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <Input
            label="Subheading Description"
            placeholder="e.g. Best deals on RC cars, puzzles and organic cotton tees"
            value={formSubtitle}
            onChange={(e) => setFormSubtitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Button Text"
              placeholder="e.g. Explore Fest"
              value={formCtaText}
              onChange={(e) => setFormCtaText(e.target.value)}
            />
            <Input
              label="Target Link (URL or route)"
              placeholder="e.g. /collections/festive"
              value={formCtaLink}
              onChange={(e) => setFormCtaLink(e.target.value)}
            />
          </div>

          {/* Desktop Image with Drag & Drop */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Desktop Banner Image (16:9 / Wide)
              </label>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setDesktopImageMode('upload')}
                  className={`px-2.5 py-0.5 rounded-md cursor-pointer ${
                    desktopImageMode === 'upload'
                      ? 'bg-white text-[#7e14ff] font-bold shadow-2xs'
                      : 'text-slate-500'
                  }`}
                >
                  Drag & Drop
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopImageMode('url')}
                  className={`px-2.5 py-0.5 rounded-md cursor-pointer ${
                    desktopImageMode === 'url'
                      ? 'bg-white text-[#7e14ff] font-bold shadow-2xs'
                      : 'text-slate-500'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {desktopImageMode === 'upload' ? (
              <div>
                {formDesktopImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2.5 flex items-center gap-3">
                    <img
                      src={formDesktopImage}
                      alt="Desktop Preview"
                      className="w-28 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Desktop Image Loaded</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {desktopFileName || 'Ready for storefront preview'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormDesktopImage('');
                        setDesktopFileName('');
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDesktopDragging(true);
                    }}
                    onDragLeave={() => setIsDesktopDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDesktopDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleProcessFile(
                          e.dataTransfer.files[0],
                          setFormDesktopImage,
                          setDesktopFileName
                        );
                      }
                    }}
                    onClick={() => desktopFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isDesktopDragging
                        ? 'border-[#7e14ff] bg-purple-50/50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      ref={desktopFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleProcessFile(
                            e.target.files[0],
                            setFormDesktopImage,
                            setDesktopFileName
                          );
                        }
                      }}
                    />
                    <UploadCloud className="w-6 h-6 text-[#7e14ff] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-700">
                      Drag & drop desktop banner image here, or{' '}
                      <span className="text-[#7e14ff] underline">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      PNG, JPG, or WebP recommended (1200x500px)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Input
                placeholder="https://images.unsplash.com/photo-..."
                value={formDesktopImage}
                onChange={(e) => setFormDesktopImage(e.target.value)}
              />
            )}
          </div>

          {/* Mobile Image with Drag & Drop */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Mobile Banner Image (Vertical / 4:5 ratio)
              </label>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setMobileImageMode('upload')}
                  className={`px-2.5 py-0.5 rounded-md cursor-pointer ${
                    mobileImageMode === 'upload'
                      ? 'bg-white text-[#7e14ff] font-bold shadow-2xs'
                      : 'text-slate-500'
                  }`}
                >
                  Drag & Drop
                </button>
                <button
                  type="button"
                  onClick={() => setMobileImageMode('url')}
                  className={`px-2.5 py-0.5 rounded-md cursor-pointer ${
                    mobileImageMode === 'url'
                      ? 'bg-white text-[#7e14ff] font-bold shadow-2xs'
                      : 'text-slate-500'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {mobileImageMode === 'upload' ? (
              <div>
                {formMobileImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2.5 flex items-center gap-3">
                    <img
                      src={formMobileImage}
                      alt="Mobile Preview"
                      className="w-16 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Mobile Image Loaded</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {mobileFileName || 'Ready for mobile phone preview'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormMobileImage('');
                        setMobileFileName('');
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsMobileDragging(true);
                    }}
                    onDragLeave={() => setIsMobileDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsMobileDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleProcessFile(
                          e.dataTransfer.files[0],
                          setFormMobileImage,
                          setMobileFileName
                        );
                      }
                    }}
                    onClick={() => mobileFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isMobileDragging
                        ? 'border-[#7e14ff] bg-purple-50/50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      ref={mobileFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleProcessFile(
                            e.target.files[0],
                            setFormMobileImage,
                            setMobileFileName
                          );
                        }
                      }}
                    />
                    <UploadCloud className="w-6 h-6 text-[#7e14ff] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-700">
                      Drag & drop mobile banner image here, or{' '}
                      <span className="text-[#7e14ff] underline">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      PNG, JPG, or WebP (600x800px recommended)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Input
                placeholder="https://images.unsplash.com/photo-..."
                value={formMobileImage}
                onChange={(e) => setFormMobileImage(e.target.value)}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
            <Input
              type="date"
              label="Start Date"
              value={formStartDate}
              onChange={(e) => setFormStartDate(e.target.value)}
            />
            <Input
              type="date"
              label="End Date"
              value={formEndDate}
              onChange={(e) => setFormEndDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as any)}
              options={[
                { value: 'Active', label: 'Active (Currently live)' },
                { value: 'Scheduled', label: 'Scheduled (Future)' },
                { value: 'Expired', label: 'Expired' },
              ]}
            />
            <Input
              type="number"
              label="Display Sort Order"
              value={formSortOrder}
              onChange={(e) => setFormSortOrder(Number(e.target.value))}
            />
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      {bannerToDelete && (
        <ConfirmModal
          isOpen={!!bannerToDelete}
          onClose={() => setBannerToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Banner?"
          message={`Are you sure you want to delete banner "${bannerToDelete.title}"? It will no longer display on the website homepage.`}
          confirmText="Delete Banner"
          isDanger
        />
      )}
    </div>
  );
};

