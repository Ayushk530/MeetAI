"use client";
import { Button } from "@/components/ui/button";
import {PlusCircleIcon, XCircleIcon} from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { StatusFilter } from "./status";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export const MeetingListHeader = () =>{
    const [isDialogOpen,setIsDialogOpen] = useState(false);
    const[filters,setFilters] = useMeetingsFilters();
    const isAnyFilterModified = !!filters.status||!!filters.search||!!filters.agentId;
    const onClearFilters = () =>{
        setFilters({
            status:null,
            agentId:"",
            search:"",
            page:1,
        });
    };
    return(
        <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}
        />
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Meetings</h5>
                <Button onClick={()=>setIsDialogOpen(true)}><PlusCircleIcon/> New Meeting</Button>
            </div>
            <ScrollArea>
            <div className="flex items-center gap-x-2 p-1">
               <MeetingsSearchFilter/>
                <StatusFilter/>
                <AgentIdFilter/>
                {isAnyFilterModified && (
                    <Button variant="outline" onClick={onClearFilters}>
                        <XCircleIcon className="size-4"/>
                        Clear
                    </Button>
                )}
            </div>
            <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </div>
        </>
    );
};