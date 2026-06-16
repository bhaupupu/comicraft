/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The marketing site ships no external <Image> sources by default — all art is
  // either SVG/CSS or generated at runtime in the Studio. Keep this open for when
  // the AI render service domain is wired in.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
