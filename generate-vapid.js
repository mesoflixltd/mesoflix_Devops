const webPush = require('web-push');
const fs = require('fs');

const vapidKeys = webPush.generateVAPIDKeys();

const envVars = `
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
`;

fs.appendFileSync('.env', envVars);
console.log('VAPID keys appended to .env');
console.log('Public Key:', vapidKeys.publicKey);
