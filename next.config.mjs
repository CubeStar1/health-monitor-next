/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: '*',
                protocol: 'https',
            },
        ],
    },
    experimental: {
        serverActions: {
          bodySizeLimit: '5mb',
        },
      },
};

export default nextConfig;
