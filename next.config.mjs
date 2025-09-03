/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
    async redirects() {
        return [
            {
                source: '/kakao',
                destination: 'https://pf.kakao.com/_xofrzn',
                permanent: true,
            },
            {
                source: '/chat',
                destination: 'https://pf.kakao.com/_xofrzn/chat',
                permanent: true,
            },
        ]
    },
}

export default nextConfig
