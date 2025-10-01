"use client";
import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";

interface Props { 
    meetingid : string;
};
export const CallView = ({
    meetingid
}:Props)=>{
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getOne.queryOptions({id:meetingid}));
    if (data.status==="completed") {
        return (
            <div className="flex h-screen items-center justify-center">
                <ErrorState
                 title="Meeting has ended"
                 description="The meeting has ended as all participants left"
                 />
            </div>
        );
    }
    return(
        <CallProvider meetingId={meetingid} meetingName={data.name} />
    );
};