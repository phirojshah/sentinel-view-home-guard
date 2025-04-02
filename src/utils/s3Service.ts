
import { s3Config, shouldUseMockData } from "@/config/s3Config";

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
  // You would implement the AWS SDK code here
  console.log(`Using S3 bucket: ${s3Config.bucketName} in region: ${s3Config.region}`);
  
  // This is a placeholder for the actual AWS SDK implementation
  throw new Error("Real S3 implementation not yet available - set useMockData to true");
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
  // You would implement the AWS SDK code here
  console.log(`Deleting from S3 bucket: ${s3Config.bucketName}`);
  
  // This is a placeholder for the actual AWS SDK implementation
  throw new Error("Real S3 implementation not yet available - set useMockData to true");
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
