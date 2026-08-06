"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId, newStatus) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    await db
      .update(orders)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/supplier/orders");
    revalidatePath("/supplier/dashboard");
    revalidatePath("/buyer/orders");

    return { success: true };
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return {
      success: false,
      error: error.message || "Failed to update order status",
    };
  }
}
