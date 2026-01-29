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
};

export default nextConfig;
