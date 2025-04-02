
import React from 'react';
import { formatTimestamp } from '@/utils/s3Service';
import { Card, CardContent } from '@/components/ui/card';
import { ImageMetadata } from '@/utils/s3Service';
import { Trash, Calendar, Clock, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCardProps {
  image: ImageMetadata;
  onView: (image: ImageMetadata) => void;
  onDelete: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onView, onDelete }) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center cursor-pointer" 
          style={{ backgroundImage: `url(${image.url})` }}
          onClick={() => onView(image)}
        />
        <div className="absolute top-2 right-2">
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8 opacity-80 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-base truncate mb-2" title={image.filename}>
          {image.filename}
        </h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-2" />
            <span>{formatTimestamp(image.timestamp)}</span>
          </div>
          <div className="flex items-center">
            <FolderOpen className="h-3.5 w-3.5 mr-2" />
            <span>{image.source}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-2" />
            <span>{image.size}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
