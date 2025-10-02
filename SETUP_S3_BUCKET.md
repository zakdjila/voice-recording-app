# S3 Bucket Configuration Fix

## Issue
The shareable links are returning "Access Denied" because the S3 bucket policy needs to be updated to allow public read access to the `shared/*` folder.

## Solution: Update S3 Bucket Policy

### Option 1: Using AWS Console (Recommended)

1. **Go to AWS S3 Console**: https://s3.console.aws.amazon.com/s3/buckets/voice-recording-app

2. **Click on the bucket** `voice-recording-app`

3. **Go to the "Permissions" tab**

4. **Scroll down to "Bucket policy"** and click "Edit"

5. **Replace the existing policy** (or add if empty) with this JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadSharedFolder",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::voice-recording-app/shared/*"
    }
  ]
}
```

6. **Click "Save changes"**

7. **Important**: You may also need to:
   - Go to "Block Public Access settings for this bucket"
   - Click "Edit"
   - **Uncheck** "Block all public access" (or at least uncheck "Block public access to buckets and objects granted through new public bucket or access point policies")
   - Confirm the changes

### Option 2: Using AWS CLI

If you have AWS CLI installed and configured:

```bash
# Apply the bucket policy
aws s3api put-bucket-policy \
  --bucket voice-recording-app \
  --policy file://S3_BUCKET_POLICY.json

# Allow public access (if blocked)
aws s3api put-public-access-block \
  --bucket voice-recording-app \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### Verify the Fix

After applying the bucket policy:

1. **Test the shareable URL** in your browser:
   - Go to the recording in the app
   - Click the share button to copy the link
   - Open it in a new tab
   - You should hear the audio file play (or download prompt)

2. **Alternative test**: Try this URL directly:
   ```
   https://voice-recording-app.s3.amazonaws.com/shared/recording_2025-10-02_18-05-35-425Z.webm
   ```
   (Replace with your actual recording filename)

## What This Policy Does

- **Allows public read access** to any object in the `shared/*` folder
- **Keeps uploads folder private** - only accessible via presigned URLs
- **Follows security best practices** - only makes shareable recordings public

## Troubleshooting

If you still get "Access Denied":

1. **Check Block Public Access Settings**:
   - Go to S3 Console → voice-recording-app → Permissions
   - Ensure "Block all public access" is OFF (or at least "BlockPublicPolicy" is OFF)

2. **Verify the bucket name** in the policy matches exactly: `voice-recording-app`

3. **Check the object exists**:
   ```bash
   aws s3 ls s3://voice-recording-app/shared/
   ```

4. **Wait 1-2 minutes** - Policy changes can take a moment to propagate

5. **Check bucket ownership**:
   - Go to Permissions → Object Ownership
   - Should be set to "Bucket owner enforced" (recommended) or "Bucket owner preferred"

## Security Notes

✅ **Safe**: Only files in the `shared/` folder are publicly accessible
✅ **Safe**: Files in `uploads/` remain private (temporary storage)
✅ **Safe**: No one can upload or delete files without AWS credentials
✅ **Safe**: Only read access (s3:GetObject) is granted, not write or delete

After you apply this policy, all shareable links will work! 🎉
