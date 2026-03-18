import { FiChevronLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const BackButton = () => {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1 text-[#050020] font-poppins text-[14px] font-[400] hover:text-accent transition-colors"
    >
      <FiChevronLeft className="w-5 h-5" />
      Back
    </button>
  )
}

export default BackButton
