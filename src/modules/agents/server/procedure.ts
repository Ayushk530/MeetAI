import {db} from "@/db";
import {string, z} from "zod";
import {agents} from "@/db/schema";
import { createTRPCRouter,baseProcedure, protectedProcedure } from "@/trpc/init";
import { create } from "domain";
import { agentsInsertSchema } from "../schemas";
import { eq, getTableColumns, sql } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getOne : protectedProcedure.input(z.object({id:z.string()})).query(async({input})=>{
        const [exsistingAgent] = await db
        .select({
            ...getTableColumns(agents),
            meetingCount : sql<number>`5`,
        })
        .from(agents)
        .where(eq(agents.id,input.id))

        return exsistingAgent;
    }),
    getMany : protectedProcedure.query(async()=>{
        const data = await db
        .select({
            ...getTableColumns(agents),
            meetingCount : sql<number>``,
    })
        .from(agents)
        return data;
    }),
    create:protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async({input,ctx})=>{
        const [createdAgent] = await db
        .insert(agents)
        .values({
            ...input,
            userId:ctx.auth.user.id,
        })
        .returning();
        return createdAgent;
    }),
});