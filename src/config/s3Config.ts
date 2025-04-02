
// S3 Configuration
export const s3Config = {
  region: "us-east-1", // Replace with your S3 bucket region
  bucketName: "your-bucket-name", // Replace with your S3 bucket name
  
  // AWS credentials (required for non-public buckets)
  accessKeyId: "YOUR_ACCESS_KEY_ID", // Replace with your AWS access key ID
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY", // Replace with your AWS secret access key
  
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

// Check if AWS credentials are configured
export const areAWSCredentialsConfigured = (): boolean => {
  return (
    s3Config.accessKeyId !== "YOUR_ACCESS_KEY_ID" && 
    s3Config.secretAccessKey !== "YOUR_SECRET_ACCESS_KEY"
  );
};
