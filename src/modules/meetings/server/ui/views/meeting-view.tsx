"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const MeetingsView= () =>{
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data.item} columns={columns}/>
            {data.item.length===0 && (<EmptyState title="Create a Meeting"
                description="Create a meeting to connect with people from all over the world and brainstorm ideas or socialise with them"/>) }
        </div>
    );
};
export const MeetingsViewLoading = () => {
    return (  
        <LoadingState
            title="Loading the Meeting"
            description="Please wait for some time!"
  />
    );
};

export const MeetingsViewError = () => {
    return (  
          <ErrorState
                 title="Meeting couldn't be loaded"
                 description="Please try after some time!"/>
    );
}
 