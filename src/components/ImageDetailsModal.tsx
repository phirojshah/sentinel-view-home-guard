
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Hash, FolderOpen } from 'lucide-react';
import { formatTimestamp, ImageMetadata } from '@/utils/s3Service';
import { Separator } from '@/components/ui/separator';

interface ImageDetailsModalProps {
  image: ImageMetadata | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (imageId: string) => void;
}

const ImageDetailsModal: React.FC<ImageDetailsModalProps> = ({
  image,
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
          <DialogDescription>
            Information about the captured image
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="rounded-md overflow-hidden border border-border">
            <img 
              src={image.url} 
              alt={image.filename} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Filename</h3>
              <p className="text-sm text-muted-foreground">{image.filename}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">Timestamp</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatTimestamp(image.timestamp)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <FolderOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">Source</h4>
                  <p className="text-sm text-muted-foreground">{image.source}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">Size</h4>
                  <p className="text-sm text-muted-foreground">{image.size}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Hash className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">ID</h4>
                  <p className="text-sm text-muted-foreground truncate">{image.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete(image.id);
            onClose();
          }}>
            Delete Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsModal;
