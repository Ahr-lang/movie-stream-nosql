require("dotenv").config();
const mongoose = require("mongoose");

const { Schema } = mongoose;

const genreSchema = new Schema({
  genreId: Number,
  name: String
});

const actorSchema = new Schema({
  name: String,
  country: String,
  birthYear: Number
});

const movieSchema = new Schema({
  movieId: Number,
  sku: String,
  title: String,
  year: Number,
  runtime: String,
  summary: String,
  imageUrl: String,
  listPrice: Number,
  mainSubject: String,
  openingDate: Date,
  wikiArticle: String,
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  actors: [{ type: Schema.Types.ObjectId, ref: "Actor" }],
  crew: [
    {
      name: String,
      role: String
    }
  ],
  commercial: {
    gross: String,
    budget: String,
    views: Number
  },
  awards: [String],
  nominations: [String]
});

const customerSchema = new Schema({
  customerId: Number,
  name: {
    first: String,
    last: String
  },
  email: String,
  contact: {
    streetAddress: String,
    postalCode: String,
    city: String,
    stateProvince: String,
    country: String,
    countryCode: String,
    continent: String,
    location: {
      lat: Number,
      long: Number
    },
    yearsCustomer: Number,
    promotionResponse: Number
  },
  demographics: {
    age: Number,
    commuteDistance: Number,
    creditBalance: Number,
    education: String,
    fullTime: String,
    gender: String,
    householdSize: Number,
    income: Number,
    incomeLevel: String,
    insufficientFundsIncidents: Number,
    jobType: String,
    lateMortgageRentPayments: Number,
    maritalStatus: String,
    mortgageAmount: Number,
    numCars: Number,
    numMortgages: Number,
    pet: String,
    rentOwn: String,
    workExperience: Number,
    yearsCurrentEmployer: Number,
    yearsResidence: Number
  },
  extension: {
    segmentId: Number,
    additionalProfileData: Object
  },
  segment: {
    segmentId: Number,
    name: String,
    shortName: String
  },
  survey: {
    completedSurvey: Boolean,
    rating: Number,
    wouldRecommend: Boolean,
    interestedInPremiumTier: Boolean,
    interestedInExclusiveOfferings: Boolean,
    mobileDevice: Boolean,
    television: Boolean
  }
});

const activitySchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  movie: { type: Schema.Types.ObjectId, ref: "Movie" },
  genre: { type: Schema.Types.ObjectId, ref: "Genre" },
  customerId: Number,
  movieId: Number,
  genreId: Number,
  activity: String,
  rating: Number,
  activityTime: Date,
  device: {
    os: String,
    app: String,
    device: String
  }
});

const customerFeedbackSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  customerId: Number,
  userId: String,
  day: Date,
  email: String,
  location: {
    city: String,
    stateProvince: String,
    country: String,
    continent: String
  },
  comment: String
});

const userSessionSchema = new Schema({
  sessionId: Number,
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  customerId: Number,
  startTime: Date,
  endTime: Date,
  elapsedTime: Number
});

const custSaleSchema = new Schema({
  day: Date,
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  movie: { type: Schema.Types.ObjectId, ref: "Movie" },
  genre: { type: Schema.Types.ObjectId, ref: "Genre" },
  customerId: Number,
  movieId: Number,
  genreId: Number,
  platform: {
    app: String,
    device: String,
    os: String
  },
  payment: {
    method: String,
    listPrice: Number,
    discountType: String,
    discountPercent: Number,
    actualPrice: Number
  }
});

const salesSampleSchema = new Schema({
  day: Date,
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  movie: { type: Schema.Types.ObjectId, ref: "Movie" },
  genre: { type: Schema.Types.ObjectId, ref: "Genre" },
  customerId: Number,
  movieId: Number,
  genreId: Number,
  platform: {
    app: String,
    device: String,
    os: String
  },
  payment: {
    method: String,
    listPrice: Number,
    discountType: String,
    discountPercent: Number,
    actualPrice: Number
  },
  source: String
});

const movieStreamChurnSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  customerId: Number,
  isChurner: Boolean,
  customerSnapshot: Object,
  genreScores: Object,
  transactionAggregates: Object,
  discountMetrics: Object,
  salesMetrics: Object
});

const Genre = mongoose.model("Genre", genreSchema);
const Actor = mongoose.model("Actor", actorSchema);
const Movie = mongoose.model("Movie", movieSchema);
const Customer = mongoose.model("Customer", customerSchema);
const Activity = mongoose.model("Activity", activitySchema);
const CustomerFeedback = mongoose.model("CustomerFeedback", customerFeedbackSchema);
const UserSession = mongoose.model("UserSession", userSessionSchema);
const CustSale = mongoose.model("CustSale", custSaleSchema);
const SalesSample = mongoose.model("SalesSample", salesSampleSchema);
const MovieStreamChurn = mongoose.model("MovieStreamChurn", movieStreamChurnSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    await Promise.all([
      Genre.deleteMany({}),
      Actor.deleteMany({}),
      Movie.deleteMany({}),
      Customer.deleteMany({}),
      Activity.deleteMany({}),
      CustomerFeedback.deleteMany({}),
      UserSession.deleteMany({}),
      CustSale.deleteMany({}),
      SalesSample.deleteMany({}),
      MovieStreamChurn.deleteMany({})
    ]);

    console.log("Old data removed");

    const genres = await Genre.insertMany([
      { genreId: 1, name: "Action" },
      { genreId: 2, name: "Comedy" },
      { genreId: 3, name: "Drama" },
      { genreId: 4, name: "Sci-Fi" },
      { genreId: 5, name: "Horror" }
    ]);

    const actors = await Actor.insertMany([
      { name: "Luna Reyes", country: "Mexico", birthYear: 1992 },
      { name: "Mateo Ruiz", country: "Mexico", birthYear: 1987 },
      { name: "Sofia Cruz", country: "Spain", birthYear: 1990 },
      { name: "Daniel Stone", country: "USA", birthYear: 1984 },
      { name: "Emma Brooks", country: "Canada", birthYear: 1995 },
      { name: "Nicolas Vega", country: "Argentina", birthYear: 1989 },
      { name: "Valeria Montes", country: "Colombia", birthYear: 1993 },
      { name: "Tom Harper", country: "UK", birthYear: 1981 },
      { name: "Akira Tanaka", country: "Japan", birthYear: 1988 },
      { name: "Mia Laurent", country: "France", birthYear: 1991 }
    ]);

    const movieTitles = [
      "Nebula Drift",
      "Midnight Runner",
      "The Last Algorithm",
      "Laugh Track City",
      "Silent Harbor",
      "Orbit of Fear",
      "The Blue Contract",
      "Pixel Hearts",
      "Shadow Market",
      "Beyond the Signal",
      "The Weekend Plan",
      "Crimson Road",
      "Dreams of Mars",
      "The Forgotten Tape",
      "Parallel Summer",
      "Final Upload",
      "Broken Compass",
      "Galaxy Diner",
      "Echoes in the Fog",
      "The Comedy Protocol"
    ];

    const movies = await Movie.insertMany(
      movieTitles.map((title, index) => {
        const genreA = genres[index % genres.length];
        const genreB = genres[(index + 2) % genres.length];

        const actorA = actors[index % actors.length];
        const actorB = actors[(index + 1) % actors.length];
        const actorC = actors[(index + 3) % actors.length];

        return {
          movieId: 101 + index,
          sku: `MOV-${101 + index}`,
          title,
          year: 2010 + (index % 15),
          runtime: `${95 + index * 3} min`,
          summary: `${title} is a MovieStream film about choices, conflict and discovery.`,
          imageUrl: `https://example.com/images/movie-${101 + index}.jpg`,
          listPrice: Number((3.99 + (index % 5)).toFixed(2)),
          mainSubject: ["Identity", "Technology", "Family", "Adventure", "Mystery"][index % 5],
          openingDate: new Date(2010 + (index % 15), index % 12, 10),
          wikiArticle: title.replaceAll(" ", "_"),
          genres: [genreA._id, genreB._id],
          actors: [actorA._id, actorB._id, actorC._id],
          crew: [
            {
              name: actors[(index + 4) % actors.length].name,
              role: "Director"
            },
            {
              name: actors[(index + 5) % actors.length].name,
              role: "Producer"
            }
          ],
          commercial: {
            gross: `$${10 + index * 2}M`,
            budget: `$${3 + index}M`,
            views: 1000 + index * 350
          },
          awards: index % 3 === 0 ? ["Best Visual Effects"] : [],
          nominations: index % 2 === 0 ? ["Best Original Score"] : []
        };
      })
    );

    const firstNames = [
      "Andrea",
      "Carlos",
      "Mariana",
      "Diego",
      "Lucia",
      "Jorge",
      "Paola",
      "Fernando",
      "Camila",
      "Ricardo",
      "Elena",
      "Miguel",
      "Valeria",
      "Santiago",
      "Natalia"
    ];

    const lastNames = [
      "Lopez",
      "Garcia",
      "Martinez",
      "Hernandez",
      "Gomez",
      "Perez",
      "Sanchez",
      "Ramirez",
      "Torres",
      "Flores",
      "Rivera",
      "Morales",
      "Castillo",
      "Vargas",
      "Rojas"
    ];

    const customers = await Customer.insertMany(
      firstNames.map((firstName, index) => {
        const customerId = 1001 + index;

        return {
          customerId,
          name: {
            first: firstName,
            last: lastNames[index]
          },
          email: `${firstName.toLowerCase()}.${lastNames[index].toLowerCase()}@example.com`,
          contact: {
            streetAddress: `Calle ${index + 1} #${100 + index}`,
            postalCode: `64${String(index).padStart(3, "0")}`,
            city: ["Monterrey", "Guadalajara", "CDMX", "Puebla", "Merida"][index % 5],
            stateProvince: ["Nuevo Leon", "Jalisco", "CDMX", "Puebla", "Yucatan"][index % 5],
            country: "Mexico",
            countryCode: "MX",
            continent: "America",
            location: {
              lat: 25.6 + index * 0.01,
              long: -100.3 - index * 0.01
            },
            yearsCustomer: 1 + (index % 6),
            promotionResponse: index % 2
          },
          demographics: {
            age: 20 + (index % 25),
            commuteDistance: 5 + index,
            creditBalance: 500 + index * 150,
            education: ["High School", "Bachelor", "Master"][index % 3],
            fullTime: index % 2 === 0 ? "Yes" : "No",
            gender: index % 2 === 0 ? "F" : "M",
            householdSize: 1 + (index % 5),
            income: 25000 + index * 3000,
            incomeLevel: ["Low", "Medium", "High"][index % 3],
            insufficientFundsIncidents: index % 4,
            jobType: ["Student", "Engineer", "Teacher", "Designer", "Manager"][index % 5],
            lateMortgageRentPayments: index % 3,
            maritalStatus: index % 2 === 0 ? "Single" : "Married",
            mortgageAmount: index % 2 === 0 ? 0 : 150000,
            numCars: index % 3,
            numMortgages: index % 2,
            pet: ["Dog", "Cat", "None"][index % 3],
            rentOwn: index % 2 === 0 ? "Rent" : "Own",
            workExperience: 1 + index,
            yearsCurrentEmployer: index % 7,
            yearsResidence: 1 + (index % 10)
          },
          extension: {
            segmentId: 1 + (index % 3),
            additionalProfileData: {
              preferredDevice: ["Mobile", "Web", "TV"][index % 3],
              preferredLanguage: "Spanish"
            }
          },
          segment: {
            segmentId: 1 + (index % 3),
            name: ["Young Professionals", "Family Viewers", "Premium Users"][index % 3],
            shortName: ["YP", "FV", "PU"][index % 3]
          },
          survey: {
            completedSurvey: true,
            rating: 3 + (index % 3),
            wouldRecommend: index % 4 !== 0,
            interestedInPremiumTier: index % 2 === 0,
            interestedInExclusiveOfferings: index % 3 === 0,
            mobileDevice: true,
            television: index % 2 === 1
          }
        };
      })
    );

    const activities = [];
    const sessions = [];
    const feedback = [];
    const custSales = [];
    const salesSamples = [];
    const churnRows = [];

    customers.forEach((customer, customerIndex) => {
      const baseDate = new Date(2026, 4, 1 + customerIndex);

      sessions.push({
        sessionId: 5001 + customerIndex,
        customer: customer._id,
        customerId: customer.customerId,
        startTime: new Date(baseDate.getTime()),
        endTime: new Date(baseDate.getTime() + 45 * 60 * 1000),
        elapsedTime: 45
      });

      feedback.push({
        customer: customer._id,
        customerId: customer.customerId,
        userId: `user_${customer.customerId}`,
        day: baseDate,
        email: customer.email,
        location: {
          city: customer.contact.city,
          stateProvince: customer.contact.stateProvince,
          country: customer.contact.country,
          continent: customer.contact.continent
        },
        comment: customerIndex % 2 === 0
          ? "Good catalog and easy to use."
          : "I would like more recommendations."
      });

      for (let j = 0; j < 3; j++) {
        const movie = movies[(customerIndex + j) % movies.length];
        const genre = genres[(customerIndex + j) % genres.length];

        activities.push({
          customer: customer._id,
          movie: movie._id,
          genre: genre._id,
          customerId: customer.customerId,
          movieId: movie.movieId,
          genreId: genre.genreId,
          activity: j === 0 ? "view" : j === 1 ? "rating" : "watch",
          rating: j === 1 ? 3 + ((customerIndex + j) % 3) : undefined,
          activityTime: new Date(baseDate.getTime() + j * 60 * 60 * 1000),
          device: {
            os: ["iOS", "Android", "Windows", "macOS"][j % 4],
            app: ["Mobile", "Web", "TV"][j % 3],
            device: ["Phone", "Laptop", "Smart TV"][j % 3]
          }
        });
      }

      const saleMovie = movies[customerIndex % movies.length];
      const saleGenre = genres[customerIndex % genres.length];
      const listPrice = saleMovie.listPrice;
      const discountPercent = customerIndex % 3 === 0 ? 20 : 10;
      const actualPrice = Number((listPrice * (1 - discountPercent / 100)).toFixed(2));

      custSales.push({
        day: baseDate,
        customer: customer._id,
        movie: saleMovie._id,
        genre: saleGenre._id,
        customerId: customer.customerId,
        movieId: saleMovie.movieId,
        genreId: saleGenre.genreId,
        platform: {
          app: ["Mobile", "Web", "TV"][customerIndex % 3],
          device: ["Phone", "Laptop", "Smart TV"][customerIndex % 3],
          os: ["iOS", "Windows", "Android"][customerIndex % 3]
        },
        payment: {
          method: ["Credit Card", "Debit Card", "PayPal"][customerIndex % 3],
          listPrice,
          discountType: discountPercent === 20 ? "Promotion" : "Standard",
          discountPercent,
          actualPrice
        }
      });

      salesSamples.push({
        day: baseDate,
        customer: customer._id,
        movie: saleMovie._id,
        genre: saleGenre._id,
        customerId: customer.customerId,
        movieId: saleMovie.movieId,
        genreId: saleGenre.genreId,
        platform: {
          app: "SampleApp",
          device: "Tablet",
          os: "Android"
        },
        payment: {
          method: "Debit Card",
          listPrice,
          discountType: "Sample",
          discountPercent: 5,
          actualPrice: Number((listPrice * 0.95).toFixed(2))
        },
        source: "SALES_SAMPLE"
      });

      churnRows.push({
        customer: customer._id,
        customerId: customer.customerId,
        isChurner: customerIndex % 5 === 0,
        customerSnapshot: {
          firstName: customer.name.first,
          lastName: customer.name.last,
          email: customer.email,
          age: customer.demographics.age,
          city: customer.contact.city,
          gender: customer.demographics.gender,
          education: customer.demographics.education,
          householdSize: customer.demographics.householdSize,
          incomeLevel: customer.demographics.incomeLevel,
          jobType: customer.demographics.jobType,
          maritalStatus: customer.demographics.maritalStatus,
          creditBalance: customer.demographics.creditBalance,
          yearsCustomer: customer.contact.yearsCustomer,
          yearsResidence: customer.demographics.yearsResidence,
          location: customer.contact.location
        },
        genreScores: {
          action: customerIndex % 5,
          comedy: (customerIndex + 1) % 5,
          drama: (customerIndex + 2) % 5,
          sciFi: (customerIndex + 3) % 5,
          horror: (customerIndex + 4) % 5
        },
        transactionAggregates: {
          numTransactionsM3: 3 + customerIndex,
          numTransactionsM4: 2 + customerIndex,
          numTransactionsM5: 1 + customerIndex,
          numTransactionsM6: customerIndex,
          salesM3: 20 + customerIndex * 2,
          salesM4: 18 + customerIndex * 2,
          salesM5: 15 + customerIndex * 2,
          salesM6: 10 + customerIndex * 2
        },
        discountMetrics: {
          avgDiscountM3: 10,
          avgDiscountM3To11: 12,
          avgDiscountM3To5: 8,
          discountPctDiffM3To5M6To11: 4,
          discountPctDiffM3To5M6To8: 3
        },
        salesMetrics: {
          avgTransactionsM3To5: 4 + customerIndex,
          avgSalesM3To5: 30 + customerIndex,
          salesPctDiffM3To5M6To8: -10 + customerIndex,
          transactionsPctDiffM3To5M6To8: -5 + customerIndex
        }
      });
    });

    await Activity.insertMany(activities);
    await UserSession.insertMany(sessions);
    await CustomerFeedback.insertMany(feedback);
    await CustSale.insertMany(custSales);
    await SalesSample.insertMany(salesSamples);
    await MovieStreamChurn.insertMany(churnRows);

    console.log("Seed completed successfully");
    console.log({
      genres: genres.length,
      actors: actors.length,
      movies: movies.length,
      customers: customers.length,
      activities: activities.length,
      userSessions: sessions.length,
      customerFeedback: feedback.length,
      custSales: custSales.length,
      salesSamples: salesSamples.length,
      movieStreamChurn: churnRows.length
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();