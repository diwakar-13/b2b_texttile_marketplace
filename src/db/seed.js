// Pehle 2 lines ko aise update kar:
import { db } from "./index.js";
import {
  profiles,
  supplierProfiles,
  buyerProfiles,
  categories,
  products,
  productImages,
} from "./schema.js";

async function seed() {
  console.log("🌱 Starting Database Seeding...");

  // 1. CLEAR EXISTING DATA (ORDER MATTERS FOR FK CONSTRAINTS)
  await db.delete(productImages);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(supplierProfiles);
  await db.delete(buyerProfiles);
  await db.delete(profiles);

  console.log("🧹 Cleaned existing tables.");

  // 2. CREATE DEMO PROFILES
  const [supplierUser1] = await db
    .insert(profiles)
    .values({
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      fullName: "Vardhman Textile Mills",
      email: "contact@vardhman.com",
      role: "supplier",
      phone: "+91 9876543210",
    })
    .returning();

  const [supplierUser2] = await db
    .insert(profiles)
    .values({
      id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
      fullName: "SilkFlora Global",
      email: "export@silkflora.com",
      role: "supplier",
      phone: "+91 9812345678",
    })
    .returning();

  // 3. CREATE SUPPLIER PROFILES
  const [supplier1] = await db
    .insert(supplierProfiles)
    .values({
      profileId: supplierUser1.id,
      businessName: "Vardhman Textiles Ltd",
      businessType: "Mill Manufacturer",
      contactNumber: "+91 9876543210",
      businessAddress: "Ludhiana Industrial Area, Punjab, India",
      operatingHours: "09:00 AM - 07:00 PM",
      fabricsOffered: "Cotton, Denim, Twill, Knits",
      minimumOrderQuantity: 500,
    })
    .returning();

  const [supplier2] = await db
    .insert(supplierProfiles)
    .values({
      profileId: supplierUser2.id,
      businessName: "SilkFlora Global Exports",
      businessType: "Exporter & Weaver",
      contactNumber: "+91 9812345678",
      businessAddress: "Bangalore Silk Hub, Karnataka, India",
      operatingHours: "10:00 AM - 06:00 PM",
      fabricsOffered: "Mulberry Silk, Tussar, Dupion, Organza",
      minimumOrderQuantity: 100,
    })
    .returning();

  console.log("✅ Created Suppliers & Profiles.");

  // 4. CREATE CATEGORIES
  const [cottonCategory] = await db
    .insert(categories)
    .values({
      name: "Cotton Fabrics",
      slug: "cotton-fabrics",
      description: "Premium breathable organic and combed cotton fabric rolls.",
      image: "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0",
    })
    .returning();

  const [silkCategory] = await db
    .insert(categories)
    .values({
      name: "Silk Fabrics",
      slug: "silk-fabrics",
      description: "100% Pure Mulberry, Satin Charmeuse, and Organza Silk.",
      image: "https://images.unsplash.com/photo-1579899368560-6dd8cb92e205",
    })
    .returning();

  const [denimCategory] = await db
    .insert(categories)
    .values({
      name: "Denim Fabrics",
      slug: "denim-fabrics",
      description: "Heavyweight selvage, stretch, and washed indigo denims.",
      image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb",
    })
    .returning();

  console.log("✅ Created Categories.");

  // 5. COTTON PRODUCTS (10 ITEMS)
  const cottonItems = [
    {
      name: "Organic Combed Cotton Single Jersey",
      gsm: 180,
      price: "180.00",
      moq: 500,
      comp: "100% Organic Cotton",
    },
    {
      name: "Heavyweight Cotton Canvas 320 GSM",
      gsm: 320,
      price: "240.00",
      moq: 300,
      comp: "100% Cotton",
    },
    {
      name: "Cotton Twill Uniform Weave",
      gsm: 240,
      price: "195.00",
      moq: 1000,
      comp: "100% Cotton",
    },
    {
      name: "Poplin Mercerized Shirt Fabric",
      gsm: 120,
      price: "150.00",
      moq: 800,
      comp: "100% Superfine Cotton",
    },
    {
      name: "French Terry Cotton Fleece",
      gsm: 280,
      price: "260.00",
      moq: 400,
      comp: "95% Cotton, 5% Lycra",
    },
    {
      name: "Cotton Slub Summer Weave",
      gsm: 160,
      price: "175.00",
      moq: 600,
      comp: "100% Natural Cotton",
    },
    {
      name: "Brushed Cotton Flannel Tartan",
      gsm: 210,
      price: "210.00",
      moq: 500,
      comp: "100% Cotton Flannel",
    },
    {
      name: "Double Gauze Muslin Fabric",
      gsm: 135,
      price: "165.00",
      moq: 750,
      comp: "100% Organic Cotton",
    },
    {
      name: "Cotton Rib Knit 2x2 stretch",
      gsm: 250,
      price: "225.00",
      moq: 350,
      comp: "98% Cotton, 2% Spandex",
    },
    {
      name: "Oxford Weave Dress Cotton",
      gsm: 190,
      price: "205.00",
      moq: 500,
      comp: "100% Cotton",
    },
  ];

  for (let i = 0; i < cottonItems.length; i++) {
    const item = cottonItems[i];
    const slug = `${item.name.toLowerCase().replace(/ /g, "-")}-${i + 1}`;

    const [product] = await db
      .insert(products)
      .values({
        supplierId: supplier1.id,
        categoryId: cottonCategory.id,
        name: item.name,
        slug: slug,
        description: `${item.name} with premium touch and high color fastness. Engineered for bulk textile buyers.`,
        material: "Cotton",
        composition: item.comp,
        gsm: item.gsm,
        width: "58-60 inches",
        color: "Natural White / Custom Dye",
        moq: item.moq,
        stock: 10000,
        price: item.price,
        isAvailable: true,
      })
      .returning();

    await db.insert(productImages).values({
      productId: product.id,
      imageUrl: `https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80`,
      altText: item.name,
      isPrimary: true,
      displayOrder: 1,
    });
  }

  console.log("✅ Seeded 10 Cotton Products.");

  // 6. SILK PRODUCTS (10 ITEMS)
  const silkItems = [
    {
      name: "Pure Mulberry Silk Charmeuse Satin",
      gsm: 90,
      price: "850.00",
      moq: 100,
      comp: "100% Mulberry Silk",
    },
    {
      name: "Raw Silk Dupion Slub Texture",
      gsm: 120,
      price: "680.00",
      moq: 150,
      comp: "100% Handloom Silk",
    },
    {
      name: "Silk Organza Sheer Weave",
      gsm: 45,
      price: "520.00",
      moq: 200,
      comp: "100% Pure Silk",
    },
    {
      name: "Habotai Pure Silk Lining",
      gsm: 55,
      price: "410.00",
      moq: 300,
      comp: "100% Habotai Silk",
    },
    {
      name: "Crepe de Chine Silk Fabric",
      gsm: 80,
      price: "740.00",
      moq: 100,
      comp: "100% Silk Crepe",
    },
    {
      name: "Tussar Wild Silk Craft",
      gsm: 110,
      price: "610.00",
      moq: 250,
      comp: "100% Tussar Silk",
    },
    {
      name: "Silk Velvet Lustrous Roll",
      gsm: 220,
      price: "990.00",
      moq: 80,
      comp: "80% Rayon, 20% Silk",
    },
    {
      name: "Georgette Pure Silk Printed",
      gsm: 65,
      price: "590.00",
      moq: 200,
      comp: "100% Silk Georgette",
    },
    {
      name: "Chiffon Silk Sheer Luxury",
      gsm: 40,
      price: "480.00",
      moq: 300,
      comp: "100% Pure Silk",
    },
    {
      name: "Silk Jacquard Floral Brocade",
      gsm: 150,
      price: "1150.00",
      moq: 50,
      comp: "100% Woven Silk",
    },
  ];

  for (let i = 0; i < silkItems.length; i++) {
    const item = silkItems[i];
    const slug = `${item.name.toLowerCase().replace(/ /g, "-")}-${i + 1}`;

    const [product] = await db
      .insert(products)
      .values({
        supplierId: supplier2.id,
        categoryId: silkCategory.id,
        name: item.name,
        slug: slug,
        description: `Export quality ${item.name} direct from certified silk spinners and weavers.`,
        material: "Silk",
        composition: item.comp,
        gsm: item.gsm,
        width: "44-45 inches",
        color: "Lustrous Gold / Emerald / Ivory",
        moq: item.moq,
        stock: 5000,
        price: item.price,
        isAvailable: true,
      })
      .returning();

    await db.insert(productImages).values({
      productId: product.id,
      imageUrl: `https://images.unsplash.com/photo-1579899368560-6dd8cb92e205?auto=format&fit=crop&w=800&q=80`,
      altText: item.name,
      isPrimary: true,
      displayOrder: 1,
    });
  }

  console.log("✅ Seeded 10 Silk Products.");
  console.log("🎉 Database Seeding Finished Successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
