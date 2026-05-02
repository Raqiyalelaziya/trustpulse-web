import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function ProofImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  return (
    <>
      <div className="relative rounded-xl overflow-hidden bg-secondary/30">
        {/* Main image */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide p-2">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setLightboxOpen(true); }}
              className="shrink-0 relative rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/40 transition-all"
            >
              <img
                src={url}
                alt={`Photo ${i + 1}`}
                className="h-20 w-20 object-cover"
              />
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {images.length} photos
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-xl p-2 bg-black/95 border-none">
          <div className="relative">
            <img
              src={images[current]}
              alt={`Photo ${current + 1}`}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}