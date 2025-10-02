/**
 * Script to apply S3 bucket policy for public read access to shared/* folder
 * Run with: node setup-bucket-policy.js
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { S3Client, PutBucketPolicyCommand, PutPublicAccessBlockCommand } = require('@aws-sdk/client-s3');

const BUCKET_NAME = 'voice-recording-app';
const REGION = 'us-east-1';

// Read AWS credentials from CSV file
function loadAWSCredentials() {
  try {
    const csvPath = path.join(__dirname, 'voice-recording-api-user_accessKeys.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const cleanContent = csvContent.replace(/^\uFEFF/, '');

    const records = parse(cleanContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const credentials = records[0];
    return {
      accessKeyId: credentials['Access key ID'],
      secretAccessKey: credentials['Secret access key']
    };
  } catch (error) {
    console.error('Error loading AWS credentials:', error.message);
    process.exit(1);
  }
}

// Bucket policy to allow public read access to shared/* folder
const bucketPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'PublicReadSharedFolder',
      Effect: 'Allow',
      Principal: '*',
      Action: 's3:GetObject',
      Resource: `arn:aws:s3:::${BUCKET_NAME}/shared/*`
    }
  ]
};

async function setupBucketPolicy() {
  console.log('🔧 Setting up S3 Bucket Policy...\n');

  // Load credentials
  const credentials = loadAWSCredentials();
  console.log('✓ AWS credentials loaded');

  // Create S3 client
  const s3Client = new S3Client({
    region: REGION,
    credentials: credentials
  });

  try {
    // Step 1: Update Public Access Block settings
    console.log('\n📝 Step 1: Updating Public Access Block settings...');

    const publicAccessBlockCommand = new PutPublicAccessBlockCommand({
      Bucket: BUCKET_NAME,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,          // Keep this ON (we don't use ACLs)
        IgnorePublicAcls: true,         // Keep this ON (we don't use ACLs)
        BlockPublicPolicy: false,       // Must be OFF to allow bucket policy
        RestrictPublicBuckets: false    // Must be OFF to allow public access
      }
    });

    await s3Client.send(publicAccessBlockCommand);
    console.log('✓ Public Access Block settings updated');

    // Step 2: Apply bucket policy
    console.log('\n📝 Step 2: Applying bucket policy...');

    const policyCommand = new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    });

    await s3Client.send(policyCommand);
    console.log('✓ Bucket policy applied successfully');

    // Success message
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ S3 Bucket Configuration Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nWhat was configured:');
    console.log('  ✓ Public read access enabled for shared/* folder');
    console.log('  ✓ Files in uploads/ remain private');
    console.log('  ✓ Shareable links will now work!\n');
    console.log('Policy Details:');
    console.log(`  • Bucket: ${BUCKET_NAME}`);
    console.log(`  • Region: ${REGION}`);
    console.log('  • Public URLs: https://voice-recording-app.s3.amazonaws.com/shared/*\n');
    console.log('🎉 You can now test the app - shareable links should work!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Error configuring bucket:', error.message);

    if (error.Code === 'AccessDenied') {
      console.error('\n⚠️  The IAM user does not have permission to modify bucket policies.');
      console.error('You need to apply the policy manually via AWS Console:');
      console.error('\n1. Go to: https://s3.console.aws.amazon.com/s3/buckets/voice-recording-app');
      console.error('2. Click "Permissions" tab');
      console.error('3. Under "Block public access", click Edit and:');
      console.error('   - Uncheck "Block all public access"');
      console.error('   - Or at minimum: uncheck "Block public and cross-account access to buckets and objects through any public bucket or access point policies"');
      console.error('4. Under "Bucket policy", click Edit and paste:');
      console.error('\n' + JSON.stringify(bucketPolicy, null, 2) + '\n');
    }

    process.exit(1);
  }
}

// Run the setup
setupBucketPolicy();
