import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compress: true,
    poweredByHeader: false,
    experimental: {
        optimizePackageImports: [
            '@mui/material',
            '@mui/icons-material',
            'lucide-react',
            'recharts',
        ],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.jsdelivr.net',
            },
        ],
    },
};

export default nextConfig;
