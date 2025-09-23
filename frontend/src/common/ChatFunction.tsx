import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"



const ChatFunction = () => {
    // const [isMessageSetting, setMessageSetting] = useState(false);
    return (
        <>
            {/* <div className='relative'>
                <EllipsisVertical
                    className='cursor-pointer'
                    onClick={() => setMessageSetting(!isMessageSetting)}
                />
                  {isMessageSetting && (
                <div className='absolute top-0 left-0 z-10 flex flex-col rounded-lg bg-black text-white px-10 py-10'>
                    <h4>Reply</h4>
                    <h4>Copy</h4>
                    <h4>Report</h4>
                    <h4>delete</h4>

                </div>

            )}



            </div>
           */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <EllipsisVertical  className="size-5"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30 bg-gray-800 text-white border-none" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="hover:bg-gray-400">
                            Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-400">
                            Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-400">
                            Report
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-400">
                            delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default ChatFunction