"use client";
import { Button } from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";

export const ListHeader = () =>{
    const [isDialogoOpen,setIsDialogOpen] = useState(false);
    return(
        <>
        <NewAgentDialog open={isDialogoOpen} onOpenChange={setIsDialogOpen}/>
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Agents</h5>
                <Button onClick={()=>setIsDialogOpen(true)}><PlusCircleIcon/> New Agent</Button>
            </div>
        </div>
        </>
    );
};