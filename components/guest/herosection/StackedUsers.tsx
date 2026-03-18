import Image from 'next/image'
import user1 from "@/public/user/1.svg"
import user2 from "@/public/user/2.svg"
import user3 from "@/public/user/3.svg"
import user4 from "@/public/user/4.svg"

/**
 * StackedUsers is a functional component that renders a section of stacked users.
 * It renders four user icons horizontally, with a text below them that says "Join thousands paying with Strimz".
 * The component is responsive and is centered in the page.
 */
const StackedUsers = () => {
    return (
        <div className='w-full flex justify-center items-center py-9'>
            <div className="flex md:flex-row flex-col justify-center md:gap-6 gap-4 items-center">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                    <Image className="w-10 h-10 rounded-full" src={user1} width={36} height={36} quality={100} priority alt="user" />
                    <Image className="w-10 h-10 rounded-full" src={user2} width={36} height={36} quality={100} priority alt="user" />
                    <Image className="w-10 h-10 rounded-full" src={user3} width={36} height={36} quality={100} priority alt="user" />
                    <Image className="w-10 h-10 rounded-full" src={user4} width={36} height={36} quality={100} priority alt="user" />
                </div>
                <p className="text-[#58556A] font-poppins font-[400] text-base text-center">Join thousands paying with Strimz</p>
            </div>
        </div>
    )
}

export default StackedUsers