import {SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import { useAgentFilters } from "../../hooks/use-agent-filter";
export const SearchFilter = () => {
    const[filters,setFilters] = useAgentFilters();
    return(
        <div className="relative">
            <Input
             placeholder="Filter by Name"
             className="h-9 bg-white [200px] pl-7"
             value={filters.search}
             onChange={(e)=>setFilters({search:e.target.value})}
             />
             <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-0.5 text-muted-foreground"/>
        </div>
    );
};