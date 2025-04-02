
import React from 'react';
import ImageCard from './ImageCard';
import { ImageMetadata } from '@/utils/s3Service';

interface ImageGridProps {
  images: ImageMetadata[];
  isLoading: boolean;
  onViewImage: (image: ImageMetadata) => void;
  onDeleteImage: (imageId: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ 
  images, 
  isLoading, 
  onViewImage, 
  onDeleteImage 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
      {isLoading ? (
        // Loading skeletons
        Array(8).fill(0).map((_, index) => (
          <div key={`skeleton-${index}`} className="rounded-lg overflow-hidden">
            <div className="loading-skeleton h-48 w-full"></div>
            <div className="p-4 space-y-3">
              <div className="loading-skeleton h-5 w-3/4"></div>
              <div className="loading-skeleton h-4 w-full"></div>
              <div className="loading-skeleton h-4 w-2/3"></div>
            </div>
          </div>
        ))
      ) : images.length > 0 ? (
        // Image cards
        images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onView={onViewImage}
            onDelete={onDeleteImage}
          />
        ))
      ) : (
        // No images found
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">No images found in your storage.</p>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
