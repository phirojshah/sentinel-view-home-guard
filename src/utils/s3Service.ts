import { s3Config, shouldUseMockData, areAWSCredentialsConfigured, getS3BucketUrl } from "@/config/s3Config";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

// This file would typically use the AWS SDK to interact with your S3 bucket
// For this example, we'll simulate the API calls

export interface ImageMetadata {
  id: string;
  filename: string;
  timestamp: string;
  url: string;
  size: string;
  source: string;
}

// Mock data for demonstration - in a real app, this would come from S3
const mockImages: ImageMetadata[] = [
  {
    id: '1',
    filename: 'intrusion_20240601_153042.jpg',
    timestamp: '2024-06-01T15:30:42Z',
    url: 'https://images.unsplash.com/photo-1517394834181-95ed159986c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    size: '3.2 MB',
    source: 'Front Door Camera'
  },
  {
    id: '2',
    filename: 'intrusion_20240601_153445.jpg',
    timestamp: '2024-06-01T15:34:45Z',
    url: 'https://images.unsplash.com/photo-1600516489510-6ff0eb6a1ba2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
    size: '2.8 MB',
    source: 'Back Door Camera'
  },
  {
    id: '3',
    filename: 'intrusion_20240602_021534.jpg',
    timestamp: '2024-06-02T02:15:34Z',
    url: 'https://images.unsplash.com/photo-1570168883418-c2b5c4c9bb6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
    size: '4.1 MB',
    source: 'Side Window Camera'
  },
  {
    id: '4',
    filename: 'intrusion_20240603_134512.jpg',
    timestamp: '2024-06-03T13:45:12Z',
    url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    size: '2.5 MB',
    source: 'Garage Camera'
  },
  {
    id: '5',
    filename: 'intrusion_20240603_180023.jpg',
    timestamp: '2024-06-03T18:00:23Z',
    url: 'https://images.unsplash.com/photo-1595859703064-f2a2c2890077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80',
    size: '3.7 MB',
    source: 'Front Door Camera'
  },
  {
    id: '6',
    filename: 'intrusion_20240604_093212.jpg',
    timestamp: '2024-06-04T09:32:12Z',
    url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1958&q=80',
    size: '2.9 MB',
    source: 'Backyard Camera'
  }
];

// Create an S3 client with the configured credentials
const createS3Client = () => {
  return new S3Client({
    region: s3Config.region,
    credentials: {
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.secretAccessKey,
    },
    // Required to make S3 Client use the appropriate URL style for the bucket
    forcePathStyle: false
  });
};

// Simulate fetching images from S3
export const fetchImages = async (): Promise<ImageMetadata[]> => {
  // Check if we should use mock data based on configuration
  if (shouldUseMockData()) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(mockImages);
      }, 1000);
    });
  }

  // For real S3 implementation (when useMockData is false)
  if (!areAWSCredentialsConfigured()) {
    throw new Error("AWS credentials not configured. Please update the S3 configuration with your access keys.");
  }

  console.log(`Using S3 bucket: ${s3Config.bucketName} in region: ${s3Config.region}`);
  console.log("AWS credentials configured:", areAWSCredentialsConfigured());

  try {
    const s3Client = createS3Client();

    // List objects in the bucket
    const command = new ListObjectsV2Command({
      Bucket: s3Config.bucketName,
      MaxKeys: 50 // Limit to 50 images
    });

    const response = await s3Client.send(command);

    if (!response.Contents) {
      console.log("No images found in the bucket");
      return [];
    }

    // Map S3 objects to ImageMetadata format
    const images: ImageMetadata[] = response.Contents.map((object, index) => {
      const filename = object.Key || `image_${index}.jpg`;
      const timestamp = object.LastModified?.toISOString() || new Date().toISOString();

      return {
        id: String(index + 1),
        filename,
        timestamp,
        url: `${getS3BucketUrl()}/${encodeURIComponent(filename)}`,
        size: formatFileSize(object.Size || 0),
        source: filename.includes('_') ? filename.split('_')[0].replace(/([A-Z])/g, ' $1').trim() : 'Unknown'
      };
    });

    return images;
  } catch (error: unknown) {
    console.error("Error fetching images from S3:", error);
    // More detailed error handling
    if (error instanceof Error) {
      if (error.name === 'NoSuchBucket') {
        throw new Error(`The bucket "${s3Config.bucketName}" does not exist`);
      } else if (error.name === 'AccessDenied') {
        throw new Error('Access denied. Check your AWS credentials and bucket permissions');
      } else if (error.message && error.message.includes('CORS')) {
        throw new Error('CORS error: Make sure CORS is configured for your S3 bucket');
      } else {
        throw error;
      }
    } else {
      throw new Error('Unknown error occurred when fetching images from S3');
    }
  }
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Simulate deleting an image from S3
export const deleteImage = async (imageId: string): Promise<boolean> => {
  console.log(`Deleting image with ID: ${imageId}`);

  if (shouldUseMockData()) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  // For real S3 implementation (when useMockData is false)
  if (!areAWSCredentialsConfigured()) {
    throw new Error("AWS credentials not configured. Please update the S3 configuration with your access keys.");
  }

  try {
    // Find the image by ID to get the filename/key
    const images = await fetchImages();
    const imageToDelete = images.find(img => img.id === imageId);

    if (!imageToDelete) {
      throw new Error(`Image with ID ${imageId} not found`);
    }

    // Extract the key from the URL
    const key = decodeURIComponent(imageToDelete.url.split('/').pop() || '');

    const s3Client = createS3Client();
    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key
    });

    await s3Client.send(command);
    console.log(`Successfully deleted image ${key} from S3`);

    return true;
  } catch (error: unknown) {
    console.error("Error deleting image from S3:", error);
    // More detailed error handling
    if (error instanceof Error) {
      if (error.name === 'NoSuchBucket') {
        throw new Error(`The bucket "${s3Config.bucketName}" does not exist`);
      } else if (error.name === 'AccessDenied') {
        throw new Error('Access denied. Check your AWS credentials and bucket permissions');
      } else if (error.name === 'NoSuchKey') {
        throw new Error(`The image "${imageId}" does not exist in the bucket`);
      } else {
        throw error;
      }
    } else {
      throw new Error('Unknown error occurred when deleting image from S3');
    }
  }
};

// Format timestamp for display
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
};
