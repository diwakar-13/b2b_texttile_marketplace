import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { carts, cartItems, orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const { shippingAddress } = await req.json();

    if (!shippingAddress || shippingAddress.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Shipping address is required" },
        { status: 400 }
      );
    }

    // 1. Get User's Cart
    const userCart = await db.query.carts.findFirst({
      where: eq(carts.profileId, user.id),
    });

    if (!userCart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    // 2. Fetch All Items in User's Cart
    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, userCart.id));

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty" },
        { status: 400 }
      );
    }

    // 3. Calculate Total Order Amount
    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    // 4. Generate Unique Order Number
    const orderNumber = `TXT-${Date.now().toString().slice(-6)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // 5. Create Order Entry
    const [newOrder] = await db
      .insert(orders)
      .values({
        profileId: user.id,
        orderNumber,
        totalAmount: totalAmount.toString(),
        shippingAddress: shippingAddress.trim(),
        status: "pending",
      })
      .returning();

    // 6. Create Order Items Entries
    const orderItemsToInsert = items.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await db.insert(orderItems).values(orderItemsToInsert);

    // 7. Clear User's Cart Items
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process order" },
      { status: 500 }
    );
  }
}