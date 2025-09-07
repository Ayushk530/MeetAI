"use client";
import { Button } from "@/components/ui/button";
import {PlusCircleIcon, XCircleIcon} from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentFilters } from "../../hooks/use-agent-filter";
import { SearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const ListHeader = () =>{
    const[filters,setFilters] = useAgentFilters();
    const [isDialogoOpen,setIsDialogOpen] = useState(false);
    const isAnyfiltermodified = !!filters.search;
    const onClearfilters = () =>{
        setFilters({
            search:"",
            page:DEFAULT_PAGE,
        });
    }
    return(
        <>
        <NewAgentDialog open={isDialogoOpen} onOpenChange={setIsDialogOpen}/>
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Agents</h5>
                <Button onClick={()=>setIsDialogOpen(true)}><PlusCircleIcon/> New Agent</Button>
            </div>
            <div className="flex items-center gap-x-2 p-1">
                <SearchFilter/>
                {isAnyfiltermodified && (
                    <Button variant="outline" size="sm" onClick={onClearfilters}>
                        <XCircleIcon/>
                         Clear
                    </Button>
                )}
            </div>
        </div>
        </>
    );
};