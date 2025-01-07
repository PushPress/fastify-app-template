import { Cluster, Redis } from "ioredis";
let connection: Redis | Cluster;

const port = +(process.env.REDIS_PORT || 6379);

if (process.env.REDIS_CLUSTER == "true") {
  connection = new Cluster(
    [
      {
        host: process.env.REDIS_HOST,
        port,
      },
    ],
    {
      // dnsLookup like this is required for elasticache compatibility
      dnsLookup: (address, callback) => {
        callback(null, address);
      },
      redisOptions: {
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
        tls: {},
      },
      slotsRefreshTimeout: Number(process.env.CACHE_SLOT_TIMEOUT) || 2500,
    },
  );
} else {
  connection = new Redis({
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    port,
  });
}

export default connection;
