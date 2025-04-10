// S3 Configuration
export const s3Config = {
  region: "ap-south-1", // Replace with your S3 bucket region
  bucketName: "", // Replace with your S3 bucket name
  
  // AWS credentials (required for non-public buckets)
  accessKeyId: "", // Replace with your AWS access key ID
  secretAccessKey: "", // Replace with your AWS secret access key
  
  // For local development with mock data
  useMockData: false, // Set to false when connecting to real S3
};

// Helper to determine if we should use real S3 or mock data
export const shouldUseMockData = (): boolean => {
  return s3Config.useMockData;
};

// Export utility function to get the S3 endpoint URL
export const getS3BucketUrl = (): string => {
  return `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com`;
};

// Check if AWS credentials are configured
export const areAWSCredentialsConfigured = (): boolean => {
  return (
    s3Config.accessKeyId !== "YOUR_ACCESS_KEY_ID" && 
    s3Config.secretAccessKey !== "YOUR_SECRET_ACCESS_KEY"
  );
};
