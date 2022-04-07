/* 
    ENV VARS:
        USE_FILEBASE
        PEERS
        OPENSHIFT_NODEJS_PORT || VCAP_APP_PORT || PORT
        AWS_ACCESS_KEY_ID
        AWS_S3_BUCKET
        AWS_SECRET_ACCESS_KEY
        NPM_CONFIG_PRODUCTION
 */
const USE_FILEBASE = process.env.USE_FILEBASE === 'true';
require('dotenv').config({ path: USE_FILEBASE ? '.env_flb' : '.env_aws' });
let Gun = require('gun');

let config = {
    peers: process.env.PEERS && process.env.PEERS.split(',') || [],
    port: process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8765,
};

config.web = require('http').createServer(Gun.serve(`${__dirname}/node_modules/gun/examples/`)).listen(config.port, '0.0.0.0');

if (USE_FILEBASE) {
    console.log(`Env var USE_FILEBASE==='true' is ${USE_FILEBASE}, using filebase's s3 endpoint...`)
    config.s3 = { endpoint: 'https://s3.filebase.com' };
} else {
    console.log(`Env var USE_FILEBASE==='true' is ${USE_FILEBASE}, using AWS default s3 endpoint...`)
}

const gun = Gun(config);

console.log(`Relay peer started on port ${config.port} with /gun`);
