#!/usr/bin/env node

/**
 * Setup S3 CORS Configuration
 * Configures the S3 bucket to allow cross-origin requests for audio playback
 */

const { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } = require('@aws-sdk/client-s3');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');

const BUCKET_NAME = 'voice-recording-app';
const REGION = 'us-east-1';

// CORS configuration for audio playback
const corsConfiguration = {
  CORSRules: [
    {
      AllowedHeaders: ['*'],
      AllowedMethods: ['GET', 'HEAD'],
      AllowedOrigins: ['*'],
      ExposeHeaders: ['ETag', 'Content-Length', 'Content-Type', 'Accept-Ranges', 'Content-Range'],
      MaxAgeSeconds: 3000
    }
  ]
};

// Load AWS credentials from CSV
function loadAWSCredentials() {
  try {
    const csvPath = path.join(__dirname, 'voice-recording-api-user_accessKeys.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error('AWS credentials CSV file not found');
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const cleanContent = csvContent.replace(/^\uFEFF/, '');

    const records = parse(cleanContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    if (records.length === 0) {
      throw new Error('No credentials found in CSV file');
    }

    const credentials = records[0];
    const accessKeyId = credentials['Access key ID'];
    const secretAccessKey = credentials['Secret access key'];

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Invalid CSV format: missing Access key ID or Secret access key');
    }

    return new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    });
  } catch (error) {
    console.error('❌ Error loading AWS credentials:', error.message);
    process.exit(1);
  }
}

// Setup CORS configuration
async function setupCORS() {
  console.log('\n🌐 Setting up S3 CORS Configuration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const s3Client = loadAWSCredentials();

  try {
    // Check existing CORS configuration
    console.log('📋 Checking existing CORS configuration...');
    try {
      const getCommand = new GetBucketCorsCommand({ Bucket: BUCKET_NAME });
      const existingCors = await s3Client.send(getCommand);
      console.log('✓ Current CORS configuration found');
      console.log(JSON.stringify(existingCors.CORSRules, null, 2));
      console.log();
    } catch (error) {
      if (error.name === 'NoSuchCORSConfiguration') {
        console.log('ℹ No existing CORS configuration found');
      } else {
        throw error;
      }
    }

    // Apply new CORS configuration
    console.log('🔧 Applying new CORS configuration...');
    const putCommand = new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: corsConfiguration
    });

    await s3Client.send(putCommand);

    console.log('✅ CORS configuration applied successfully!\n');
    console.log('Configuration details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Bucket:', BUCKET_NAME);
    console.log('Region:', REGION);
    console.log('Allowed Methods: GET, HEAD');
    console.log('Allowed Origins: * (all)');
    console.log('Allowed Headers: * (all)');
    console.log('Max Age: 3000 seconds');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✓ Audio files should now be accessible from your web app!');
    console.log('✓ This allows cross-origin requests for audio playback.\n');

  } catch (error) {
    console.error('❌ Failed to setup CORS:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Ensure your AWS credentials have s3:PutBucketCors permission');
    console.error('2. Verify the bucket name is correct');
    console.error('3. Check that the bucket exists in the specified region\n');
    process.exit(1);
  }
}

// Run the setup
setupCORS();


