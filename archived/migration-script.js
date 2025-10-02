// Run this in your browser console or as a script to migrate your data
// Make sure to set up your .env.local file first

async function runMigration() {
  try {
    console.log("🚀 Starting property migration...");

    // First check if we have properties in the database
    const response = await fetch("/api/properties");
    const existingProperties = await response.json();

    if (existingProperties.length > 0) {
      console.log(
        `⚠️  Found ${existingProperties.length} existing properties in database.`
      );
      const confirm = window.confirm(
        "Properties already exist. Do you want to clear them and re-import?"
      );
      if (!confirm) {
        console.log("Migration cancelled.");
        return;
      }
    }

    // Get the static properties to migrate
    const staticProperties = [
      // You would add your static properties here or import them
      // For now, we'll create a sample property
      {
        name: "Modern Villa with Pool",
        slug: "modern-villa-with-pool",
        location: "Beverly Hills, CA",
        rate: "2,500,000",
        area: 350,
        beds: 4,
        baths: 3,
        photo_sphere: "/360.jpg",
        property_type: "house",
        images: [
          { src: "/images/properties/property1/property1.jpg" },
          { src: "/images/properties/property1/image-2.jpg" },
        ],
      },
      {
        name: "Downtown Luxury Apartment",
        slug: "downtown-luxury-apartment",
        location: "Manhattan, NY",
        rate: "1,200,000",
        area: 120,
        beds: 2,
        baths: 2,
        photo_sphere: null,
        property_type: "apartment",
        images: [{ src: "/images/properties/property2/property2.jpg" }],
      },
      {
        name: "Prime Commercial Plot",
        slug: "prime-commercial-plot",
        location: "Silicon Valley, CA",
        rate: "800,000",
        area: 500,
        beds: null,
        baths: null,
        photo_sphere: null,
        property_type: "plot",
        images: [{ src: "/images/properties/property3/property3.jpg" }],
      },
    ];

    console.log(`📝 Migrating ${staticProperties.length} sample properties...`);

    // Insert each property
    for (let i = 0; i < staticProperties.length; i++) {
      const property = staticProperties[i];
      console.log(`➡️  Creating: ${property.name}`);

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(property),
      });

      if (response.ok) {
        console.log(`✅ Created: ${property.name}`);
      } else {
        const error = await response.json();
        console.error(`❌ Failed to create ${property.name}:`, error);
      }
    }

    console.log(
      "🎉 Migration completed! Refresh the explore page to see your properties."
    );
  } catch (error) {
    console.error("💥 Migration failed:", error);
  }
}

// Run the migration
runMigration();
