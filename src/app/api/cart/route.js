import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { carts, cartItems, products, productImages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: true, cart: [] });

    let userCart = await db.query.carts.findFirst({
      where: eq(carts.profileId, user.id),
    });

    if (!userCart) return NextResponse.json({ success: true, cart: [] });

    const items = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        price: cartItems.price,
        title: products.name,
        image: productImages.imageUrl,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(
        productImages,
        and(
          eq(productImages.productId, products.id),
          eq(productImages.isPrimary, true),
        ),
      )
      .where(eq(cartItems.cartId, userCart.id));

    return NextResponse.json({ success: true, cart: items });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const {
      productId,
      quantity = 1,
      price,
      isAbsolute = false,
    } = await req.json();

    let userCart = await db.query.carts.findFirst({
      where: eq(carts.profileId, user.id),
    });

    if (!userCart) {
      const [newCart] = await db
        .insert(carts)
        .values({ profileId: user.id })
        .returning();
      userCart = newCart;
    }

    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, userCart.id),
        eq(cartItems.productId, productId),
      ),
    });

    if (existingItem) {
      const newQuantity = isAbsolute
        ? quantity
        : existingItem.quantity + quantity;
      await db
        .update(cartItems)
        .set({
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId: userCart.id,
        productId,
        quantity,
        price: price.toString(),
      });
    }

    return NextResponse.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "Item ID missing" },
        { status: 400 },
      );
    }

    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    return NextResponse.json({ success: true, message: "Item removed" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
