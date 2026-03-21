import { SideBarLinksTypes } from "@/types/dashboard";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { GoHome } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { AiOutlineDollar } from "react-icons/ai";
import { MdOutlineSubscriptions } from "react-icons/md";

export const UserSideBarLinks: SideBarLinksTypes[] = [
    {
        href: "/user",
        title: "Home",
        icon: <GoHome className="w-[21px] h-[21px]" />
    },
    {
        href: "/user/utility-bills",
        title: "Utility Bills",
        icon: <LiaMoneyBillWaveAltSolid className="w-[21px] h-[21px]" />
    },
    {
        href: "/user/subscriptions",
        title: "Subscriptions",
        icon: <MdOutlineSubscriptions className="w-[21px] h-[21px]" />
    },
]

export const BusinessSideBarLinks: SideBarLinksTypes[] = [
    {
        href: "/business",
        title: "Home",
        icon: <GoHome className="w-[21px] h-[21px]" />
    },
    {
        href: "/business/transactions",
        title: "Transactions",
        icon: <AiOutlineDollar className="w-[21px] h-[21px]" />
    },
    {
        href: "/business/customers",
        title: "Customers",
        icon: <LuUsers className="w-[21px] h-[21px]" />
    },
];