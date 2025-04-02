
// S3 Configuration
export const s3Config = {
  region: "us-east-1", // Replace with your S3 bucket region
  bucketName: "your-bucket-name", // Replace with your S3 bucket name
  
  // For local development with mock data
  useMockData: true, // Set to false when connecting to real S3
};

// Helper to determine if we should use real S3 or mock data
export const shouldUseMockData = (): boolean => {
  return s3Config.useMockData;
};

// Export utility function to get the S3 endpoint URL
export const getS3BucketUrl = (): string => {
  return `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com`;
};
