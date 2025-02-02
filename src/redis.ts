import { Cluster, Redis } from "ioredis";

const port = +(process.env.REDIS_PORT || 6379);

let conn: Redis | Cluster;
export function connection() {
  if (process.env.REDIS_CLUSTER == "true") {
    conn = new Cluster(
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
    conn = new Redis({
      host: process.env.REDIS_HOST,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      port,
    });
  }
  return conn;
}
