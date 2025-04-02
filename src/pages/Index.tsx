
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import ImageGrid from '@/components/ImageGrid';
import ImageDetailsModal from '@/components/ImageDetailsModal';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import StatusBar from '@/components/StatusBar';
import { fetchImages, deleteImage, ImageMetadata } from '@/utils/s3Service';
import { formatTimestamp } from '@/utils/s3Service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Shield } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(
    formatTimestamp(new Date().toISOString())
  );

  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, []);

  // Function to load images from S3
  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchImages();
      setImages(data);
      setLastUpdated(formatTimestamp(new Date().toISOString()));
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load images from storage.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image deletion
  const handleDeleteImage = (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      setImageToDelete(imageId);
      setDeleteDialogOpen(true);
    }
  };

  // Function to confirm and process image deletion
  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;
    
    setDeleteDialogOpen(false);
    
    try {
      await deleteImage(imageToDelete);
      
      // Update state to remove the deleted image
      setImages(prevImages => prevImages.filter(img => img.id !== imageToDelete));
      
      toast({
        title: 'Image Deleted',
        description: 'The image has been successfully deleted.',
      });
      
      setLastUpdated(formatTimestamp(new Date().toISOString()));
    } catch (err) {
      console.error('Error deleting image:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the image. Please try again.',
      });
    } finally {
      setImageToDelete(null);
    }
  };

  // Function to view image details
  const handleViewImage = (image: ImageMetadata) => {
    setSelectedImage(image);
    setDetailsModalOpen(true);
  };

  // Get the image filename for the confirmation dialog
  const getImageFilenameToDelete = () => {
    if (!imageToDelete) return '';
    const image = images.find(img => img.id === imageToDelete);
    return image?.filename || '';
  };

  // Determine system status based on recent images
  const getSystemStatus = () => {
    if (images.length === 0) return 'idle';
    
    // Check if there are any images from the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentImages = images.filter(img => {
      const imgDate = new Date(img.timestamp);
      return imgDate > oneDayAgo;
    });
    
    return recentImages.length > 0 ? 'alert' : 'secure';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Security Monitoring Dashboard</h1>
        </div>

        <StatusBar status={getSystemStatus()} lastUpdated={lastUpdated} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Images</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{images.length}</div>
              <p className="text-xs text-muted-foreground">Captured security images</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Last Detection</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {images.length > 0 
                  ? formatTimestamp(images[0].timestamp).split(',')[0] 
                  : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">Most recent activity</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {images.reduce((total, img) => {
                  const size = parseFloat(img.size.replace(' MB', ''));
                  return total + size;
                }, 0).toFixed(1)} MB
              </div>
              <p className="text-xs text-muted-foreground">Used storage space</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Captured Images</h2>
          {error ? (
            <div className="bg-red-100 border border-red-200 text-red-800 rounded-lg p-4">
              {error}
            </div>
          ) : (
            <ImageGrid
              images={images}
              isLoading={isLoading}
              onViewImage={handleViewImage}
              onDeleteImage={handleDeleteImage}
            />
          )}
        </div>
      </div>

      {/* Image Details Modal */}
      <ImageDetailsModal
        image={selectedImage}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onDelete={handleDeleteImage}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteImage}
        imageFilename={getImageFilenameToDelete()}
      />
    </DashboardLayout>
  );
};

export default Index;
