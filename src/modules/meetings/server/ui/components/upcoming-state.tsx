import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { BanIcon, VideoIcon } from "lucide-react"
import Link from "next/link"

interface Props { 
    meetingid :  string;
    onCancelMeeting : ()=>void;
    isCancelling :boolean;
}
export const UpcomingState = ({meetingid,onCancelMeeting,isCancelling}:Props) => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
             image="/upcoming.svg"
             title="Meeting not yet started"
             description="After starting the meeting its summary will appear here"/>
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button variant="secondary" className="w-full lg:w-auto"
                onClick = {onCancelMeeting} disabled={isCancelling}>
                    <BanIcon/>
                    Cancel Meeting
                </Button>
                <Button disabled={isCancelling} asChild className="w-full lg:w-auto">
                    <Link href={`/call/${meetingid}`}>
                    <VideoIcon/>
                    Start Meeting
                    </Link>
                </Button>
            </div>
        </div>
    )
}