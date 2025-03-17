const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.sittingAssignment.deleteMany({});
    await prisma.sittingRequest.deleteMany({});
    await prisma.availabilitySlot.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.workExperience.deleteMany({});
    await prisma.pet.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("Cleared existing data");

    // Create users
    const passwordHash = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password_hash: passwordHash,
        first_name: "Admin",
        last_name: "User",
        is_admin: true,
        phone: "555-123-4567",
        address: "123 Admin St, City, State 12345",
        bio: "System administrator and pet lover.",
      },
    });

    const users = [];
    for (let i = 1; i <= 4; i++) {
      const user = await prisma.user.create({
        data: {
          email: `user${i}@example.com`,
          password_hash: passwordHash,
          first_name: `User${i}`,
          last_name: `Test`,
          phone: `555-${i}00-${i}000`,
          address: `${i}00 Test St, City, State 12345`,
          bio: `Test user ${i} who loves pets.`,
        },
      });
      users.push(user);
    }

    console.log("Created users");

    // Create pets
    const petTypes = [
      "Dog",
      "Cat",
      "Bird",
      "Fish",
      "Rabbit",
      "Hamster",
      "Guinea Pig",
      "Reptile",
    ];
    const petNames = [
      "Buddy",
      "Max",
      "Charlie",
      "Lucy",
      "Bailey",
      "Cooper",
      "Daisy",
      "Sadie",
      "Molly",
      "Stella",
    ];

    const pets = [];
    for (let i = 0; i < 10; i++) {
      const owner = users[i % users.length];
      const petType = petTypes[i % petTypes.length];

      let breed = "";
      if (petType === "Dog") {
        breed = [
          "Labrador",
          "German Shepherd",
          "Golden Retriever",
          "Bulldog",
          "Beagle",
        ][i % 5];
      } else if (petType === "Cat") {
        breed = ["Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal"][
          i % 5
        ];
      }

      const pet = await prisma.pet.create({
        data: {
          owner_id: owner.id,
          name: petNames[i],
          animal_type: petType,
          breed,
          age: Math.floor(Math.random() * 10) + 1,
          color: ["Black", "White", "Brown", "Gray", "Golden"][i % 5],
          markers: i % 3 === 0 ? "Has a spot on the left ear" : "",
          allergies: i % 4 === 0 ? "Allergic to chicken" : "",
          diet: `Regular ${petType.toLowerCase()} food, twice a day`,
          preferences: `Loves to ${
            petType === "Dog"
              ? "play fetch"
              : petType === "Cat"
              ? "chase toys"
              : "be petted"
          }`,
        },
      });
      pets.push(pet);
    }

    console.log("Created pets");

    // Create certificates
    for (let i = 0; i < users.length; i++) {
      if (i % 2 === 0) {
        await prisma.certificate.create({
          data: {
            user_id: users[i].id,
            name: "Pet First Aid Certification",
            issuing_organization: "Pet Safety Association",
            issue_date: new Date(2022, 0, 1),
            expiry_date: new Date(2024, 0, 1),
            file_url: "/uploads/certificates/sample-certificate.pdf",
            verified: i === 0, // Admin's certificate is verified
          },
        });
      }
    }

    console.log("Created certificates");

    // Create work experiences
    for (let i = 0; i < users.length; i++) {
      await prisma.workExperience.create({
        data: {
          user_id: users[i].id,
          title: "Pet Sitter",
          organization: "Local Pet Care",
          start_date: new Date(2020, 0, 1),
          end_date: i % 2 === 0 ? null : new Date(2021, 11, 31),
          description:
            "Provided care for various pets including feeding, walking, and administering medication.",
        },
      });
    }

    console.log("Created work experiences");

    // Create availability slots
    const today = new Date();

    for (let i = 0; i < users.length; i++) {
      for (let j = 1; j <= 5; j++) {
        const date = new Date(today);
        date.setDate(today.getDate() + j);

        // Different times for different users
        const startHour = 8 + i;
        const endHour = startHour + 8;

        // Different accepted pet types for different slots
        const acceptedPetTypes =
          j % 3 === 0
            ? ["Dog", "Cat"]
            : j % 3 === 1
            ? ["Dog", "Cat", "Bird", "Rabbit"]
            : petTypes;

        await prisma.availabilitySlot.create({
          data: {
            user_id: users[i].id,
            date,
            start_time: `${startHour}:00`,
            end_time: `${endHour}:00`,
            max_pets: (i % 3) + 1,
            accepted_pet_types: acceptedPetTypes,
          },
        });
      }
    }

    console.log("Created availability slots");

    // Create sitting requests
    for (let i = 0; i < 5; i++) {
      const requester = users[i % users.length];
      const pet = pets.find((p) => p.owner_id === requester.id);

      if (pet) {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + i + 3);
        startDate.setHours(10, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(18, 0, 0);

        await prisma.sittingRequest.create({
          data: {
            requester_id: requester.id,
            pet_id: pet.id,
            start_datetime: startDate,
            end_datetime: endDate,
            notes: `Please take good care of ${pet.name}!`,
            status: "pending",
          },
        });
      }
    }

    console.log("Created sitting requests");

    // Create some accepted requests with assignments
    for (let i = 0; i < 3; i++) {
      const requester = users[i % users.length];
      const sitter = users[(i + 1) % users.length]; // Different user as sitter
      const pet = pets.find((p) => p.owner_id === requester.id);

      if (pet) {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + i + 10);
        startDate.setHours(9, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(17, 0, 0);

        const request = await prisma.sittingRequest.create({
          data: {
            requester_id: requester.id,
            pet_id: pet.id,
            start_datetime: startDate,
            end_datetime: endDate,
            notes: `Please take good care of ${pet.name}!`,
            status: "accepted",
          },
        });

        await prisma.sittingAssignment.create({
          data: {
            request_id: request.id,
            sitter_id: sitter.id,
            status: "accepted",
          },
        });
      }
    }

    console.log("Created sitting assignments");

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error; // Re-throw to see the full error stack
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
