require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { Schema } = mongoose;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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

const Genre = mongoose.model("Genre", genreSchema);
const Actor = mongoose.model("Actor", actorSchema);
const Movie = mongoose.model("Movie", movieSchema);

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

app.get("/", (req, res) => {
  res.redirect("/movies");
});

/* =========================
   MOVIES CRUD
========================= */

app.get("/movies", async (req, res) => {
  const search = req.query.search || "";
  const genre = req.query.genre || "";

  const filter = {};

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (genre) {
    filter.genres = genre;
  }

  const movies = await Movie.find(filter)
    .populate("genres")
    .populate("actors")
    .sort({ title: 1 });

  const genres = await Genre.find().sort({ name: 1 });

  res.render("movies/index", {
    movies,
    genres,
    search,
    selectedGenre: genre
  });
});

app.get("/movies/new", async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  const actors = await Actor.find().sort({ name: 1 });

  res.render("movies/form", {
    movie: null,
    genres,
    actors,
    action: "/movies",
    title: "Create Movie"
  });
});

app.post("/movies", async (req, res) => {
  const selectedGenres = toArray(req.body.genres);
  const selectedActors = toArray(req.body.actors);

  await Movie.create({
    movieId: Number(req.body.movieId),
    sku: req.body.sku,
    title: req.body.title,
    year: Number(req.body.year),
    runtime: req.body.runtime,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    listPrice: Number(req.body.listPrice),
    mainSubject: req.body.mainSubject,
    openingDate: req.body.openingDate ? new Date(req.body.openingDate) : null,
    wikiArticle: req.body.wikiArticle,
    genres: selectedGenres,
    actors: selectedActors,
    commercial: {
      gross: req.body.gross,
      budget: req.body.budget,
      views: Number(req.body.views || 0)
    },
    awards: req.body.awards
      ? req.body.awards.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
    nominations: req.body.nominations
      ? req.body.nominations.split(",").map((item) => item.trim()).filter(Boolean)
      : []
  });

  res.redirect("/movies");
});

app.get("/movies/:id/edit", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  const genres = await Genre.find().sort({ name: 1 });
  const actors = await Actor.find().sort({ name: 1 });

  res.render("movies/form", {
    movie,
    genres,
    actors,
    action: `/movies/${movie._id}/edit`,
    title: "Edit Movie"
  });
});

app.post("/movies/:id/edit", async (req, res) => {
  const selectedGenres = toArray(req.body.genres);
  const selectedActors = toArray(req.body.actors);

  await Movie.findByIdAndUpdate(req.params.id, {
    movieId: Number(req.body.movieId),
    sku: req.body.sku,
    title: req.body.title,
    year: Number(req.body.year),
    runtime: req.body.runtime,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    listPrice: Number(req.body.listPrice),
    mainSubject: req.body.mainSubject,
    openingDate: req.body.openingDate ? new Date(req.body.openingDate) : null,
    wikiArticle: req.body.wikiArticle,
    genres: selectedGenres,
    actors: selectedActors,
    commercial: {
      gross: req.body.gross,
      budget: req.body.budget,
      views: Number(req.body.views || 0)
    },
    awards: req.body.awards
      ? req.body.awards.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
    nominations: req.body.nominations
      ? req.body.nominations.split(",").map((item) => item.trim()).filter(Boolean)
      : []
  });

  res.redirect("/movies");
});

app.post("/movies/:id/delete", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.redirect("/movies");
});

/* =========================
   GENRES CRUD
========================= */

app.get("/genres", async (req, res) => {
  const search = req.query.search || "";

  const filter = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

  const genres = await Genre.find(filter).sort({ name: 1 });

  res.render("genres/index", {
    genres,
    search
  });
});

app.get("/genres/new", (req, res) => {
  res.render("genres/form", {
    genre: null,
    action: "/genres",
    title: "Create Genre"
  });
});

app.post("/genres", async (req, res) => {
  await Genre.create({
    genreId: Number(req.body.genreId),
    name: req.body.name
  });

  res.redirect("/genres");
});

app.get("/genres/:id/edit", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  res.render("genres/form", {
    genre,
    action: `/genres/${genre._id}/edit`,
    title: "Edit Genre"
  });
});

app.post("/genres/:id/edit", async (req, res) => {
  await Genre.findByIdAndUpdate(req.params.id, {
    genreId: Number(req.body.genreId),
    name: req.body.name
  });

  res.redirect("/genres");
});

app.post("/genres/:id/delete", async (req, res) => {
  const genreId = req.params.id;

  await Movie.updateMany(
    { genres: genreId },
    { $pull: { genres: genreId } }
  );

  await Genre.findByIdAndDelete(genreId);

  res.redirect("/genres");
});

/* =========================
   START SERVER
========================= */

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`MovieStream app running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting app:", error);
    process.exit(1);
  }
}

start();
