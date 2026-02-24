import { motion } from "framer-motion"

export default function CameraLandscapeWarning({ title }: { title: string }) {
  return (
    <motion.div
      className="hidden landscape:flex justify-center items-center flex-col fixed inset-0 bg-black/85 z-[5]">
      <div className="w-16 mx-auto">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="8" width="28" height="48" rx="4" stroke="#a78bfa" strokeWidth="2.5" />
          <circle cx="32" cy="50" r="2" fill="#a78bfa" />
          <path d="M10 32l6-5v10l-6-5z" fill="#a78bfa" opacity="0.6" />
          <path d="M54 32l-6-5v10l6-5z" fill="#a78bfa" opacity="0.6" />
          <path d="M8 27c-3 3-3 7 0 10" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M56 27c3 3 3 7 0 10" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      </div>
      <div className="text-xl text-white text-center mt-6">
        <p className="whitespace-pre" dangerouslySetInnerHTML={{ __html: title }}></p>
      </div>
    </motion.div>
  )
}