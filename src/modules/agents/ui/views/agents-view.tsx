"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFormControl } from "react-hook-form";
import { DataTable } from "../components/data-table";
import { columns} from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useActionState } from "react";
import { useAgentFilters } from "../../hooks/use-agent-filter";
import { DataPagination } from "../components/data-pagination";


export const AgentsView = () => {
    const [filters,setFilters] = useAgentFilters();
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));
return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
        <DataTable data={data.item} columns={columns}/>
        <DataPagination
         page = {filters.page}
         totalPages= {data.totalPages}
         onPageChange = {(page)=>setFilters({page})}
         />
        {data.item.length===0 && (<EmptyState title="Create Agent"
        description="Create an Agent to help you summarize meeting content and host them for you"/>) }
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
 