import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // Schema import karo

const client = postgres(process.env.DATABASE_URL);

// Schema ko option object mein pass karo
export const db = drizzle(client, { schema });