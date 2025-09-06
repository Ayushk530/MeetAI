"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFormControl } from "react-hook-form";

export const AgentsView = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());
return (
    <div>
        {JSON.stringify(data,null,2)}
    </div>
);
};

export const AgentsViewLoading = () => {
    return (  
        <LoadingState
            title="Loading all the agents"
            description="Please wait for some time!"
  />
    );
};

export const AgentsViewError = () => {
    return (  
          <ErrorState
                 title="Agents couldn't be loaded"
                 description="Please try after some time!"/>
    );
}
 