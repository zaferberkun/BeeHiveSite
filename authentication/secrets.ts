// Interface to Google Secrets cloud service

import { SecretManagerServiceClient as $SecretManagerServiceClient } from '@google-cloud/secret-manager';
const client: $SecretManagerServiceClient = new $SecretManagerServiceClient({ projectId: 'bipoc-322918' });

// name - 
async function accessSecretVersion(name: string) {
  let version: any;
  [version] = await client.accessSecretVersion({
    name: name,
  });

  // Extract the payload as a string.
  const payload = version.payload.data.toString();

  return payload;
}

const MONGO_URI = await accessSecretVersion('projects/beehive-website-338201/secrets/MONGO_URI/versions/1');
const GMAIL_PASS_SECRET = await accessSecretVersion('projects/147003015602/secrets/GMAIL_PASS_SECRET/versions/2');
const GMAIL_USER_SECRET = await accessSecretVersion('projects/147003015602/secrets/GMAIL_USER_SECRET/versions/3')
console.log(GMAIL_USER_SECRET);

export { MONGO_URI, GMAIL_USER_SECRET, GMAIL_PASS_SECRET }