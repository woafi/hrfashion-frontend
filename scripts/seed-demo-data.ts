/**
 * Seed demo data for HR Fashion backend MongoDB database.
 * 
 * - Populates products, jobs, services, and team members with realistic demo data.
 * - Uses real Unsplash fashion/corporate image URLs for images.
 * - Idempotent-friendly: checks for existing unique records before inserting.
 *
 * Run: npx tsx scripts/seed-demo-data.ts  (from backend/frontend directory)
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const client = (await import("../src/lib/mongodb")).default;

  await client.connect();
  const db = client.db(process.env.DATABASE_NAME as string);

  console.log("Connected to database. Starting demo data seeding...");

  // ---- 1. Seed Products ----
  const productsCollection = db.collection("products");
  const productsCount = await productsCollection.countDocuments();

  if (productsCount === 0) {
    const sampleProducts = [
      {
        title: "Classic Tailored Wool Blazer",
        shortDescription: "A timeless tailored wool blazer designed for professional elegance.",
        fullDescription: "Crafted from premium virgin wool, this classic tailored blazer features structured shoulders, a single-button closure, and subtle interior lining. Perfect for boardroom meetings or elevated evening wear.",
        price: 189.99,
        category: "Outerwear",
        images: [
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=60"
        ],
        stock: 25,
        rating: 4.8,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Charcoal", "Navy", "Black"],
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Silk Charmeuse Midi Dress",
        shortDescription: "An effortless slip midi dress crafted from luxurious silk charmeuse.",
        fullDescription: "Flowing gracefully with every step, this silk midi dress features a delicate cowl neckline, adjustable straps, and a bias-cut silhouette that flatters any figure.",
        price: 145.50,
        category: "Dresses",
        images: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=60"
        ],
        stock: 15,
        rating: 4.9,
        sizes: ["XS", "S", "M", "L"],
        colors: ["Emerald", "Champagne", "Ruby"],
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Relaxed Fit Linen Trousers",
        shortDescription: "Breathable high-waisted linen trousers for warm-weather sophistication.",
        fullDescription: "Made from 100% organic French linen, these trousers offer a relaxed wide-leg fit with an elasticated back waistband for all-day comfort without compromising style.",
        price: 95.00,
        category: "Bottoms",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=60"
        ],
        stock: 40,
        rating: 4.6,
        sizes: ["S", "M", "L"],
        colors: ["Beige", "White", "Olive"],
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await productsCollection.insertMany(sampleProducts);
    console.log(`✅ Seeded ${sampleProducts.length} products.`);
  } else {
    console.log("ℹ️ Products collection already populated. Skipping.");
  }

  // ---- 2. Seed Jobs (Careers) ----
  const jobsCollection = db.collection("jobs");
  const jobsCount = await jobsCollection.countDocuments();

  if (jobsCount === 0) {
    const sampleJobs = [
      {
        title: "Senior Fashion Designer",
        department: "Design",
        location: "New York, NY (Hybrid)",
        type: "full-time",
        description: "We are seeking a visionary Senior Fashion Designer to lead our upcoming seasonal collection, oversee sketching, fabric sourcing, and collaborate closely with our production teams.",
        requirements: [
          "Minimum 5+ years of experience in contemporary women's wear design",
          "Proficiency in Adobe Illustrator, Photoshop, and CAD software",
          "Strong understanding of textiles, draping, and garment construction",
          "Bachelor's degree in Fashion Design or related field"
        ],
        status: "open",
        postedBy: "HR Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "E-Commerce Merchandising Intern",
        department: "E-Commerce",
        location: "Remote",
        type: "internship",
        description: "Join our digital storefront team to assist with product categorization, inventory tracking, site layout optimization, and weekly sales performance analytics.",
        requirements: [
          "Currently pursuing a degree in Business, Marketing, or Merchandising",
          "Exceptional organizational skills and attention to detail",
          "Familiarity with Shopify or modern headless e-commerce platforms",
          "Self-motivated with a passion for digital fashion retail"
        ],
        status: "open",
        postedBy: "HR Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await jobsCollection.insertMany(sampleJobs);
    console.log(`✅ Seeded ${sampleJobs.length} jobs.`);
  } else {
    console.log("ℹ️ Jobs collection already populated. Skipping.");
  }

  // ---- 3. Seed Services ----
  const servicesCollection = db.collection("services");
  const servicesCount = await servicesCollection.countDocuments();

  if (servicesCount === 0) {
    const sampleServices = [
      {
        title: "Personal Styling & Consultation",
        description: "One-on-one virtual or in-person styling sessions tailored to your lifestyle, body type, and wardrobe needs.",
        icon: "Sparkles",
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Custom Tailoring & Alterations",
        description: "Expert garment adjustments and bespoke tailoring to ensure the flawless fit of every piece you own.",
        icon: "Scissors",
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Sustainable Garment Recycling",
        description: "Drop off your pre-loved HR Fashion garments for store credits while helping us reduce textile waste.",
        icon: "Recycle",
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await servicesCollection.insertMany(sampleServices);
    console.log(`✅ Seeded ${sampleServices.length} services.`);
  } else {
    console.log("ℹ️ Services collection already populated. Skipping.");
  }

  // ---- 4. Seed Team Members ----
  const teamCollection = db.collection("team");
  const teamCount = await teamCollection.countDocuments();

  if (teamCount === 0) {
    const sampleTeam = [
      {
        name: "Elena Rostova",
        designation: "Founder & Creative Director",
        description: "With over 15 years in luxury fashion houses across Milan and Paris, Elena guides the timeless artistic vision behind every HR Fashion collection.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60",
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Marcus Vance",
        designation: "Head of Sustainable Production",
        description: "Marcus spearheads our commitment to ethical sourcing, eco-friendly fabrics, and transparent supply chains worldwide.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await teamCollection.insertMany(sampleTeam);
    console.log(`✅ Seeded ${sampleTeam.length} team members.`);
  } else {
    console.log("ℹ️ Team collection already populated. Skipping.");
  }

  console.log("✨ Database demo seeding complete successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });