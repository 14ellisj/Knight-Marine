import { isSupabaseConfigured, supabase } from "./supabase-client.js";

const grid = document.querySelector("[data-story-grid]");
const empty = document.querySelector("[data-stories-empty]");
const status = document.querySelector("[data-stories-status]");

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function makeStoryCard(story) {
  const card = document.createElement("article");
  card.className = "story-card";

  const link = document.createElement("a");
  link.className = "story-card-link";
  link.href = `story.html?slug=${encodeURIComponent(story.slug)}`;
  link.setAttribute("aria-label", `Read ${story.title}`);

  if (story.image_urls?.[0]) {
    const image = document.createElement("img");
    image.src = story.image_urls[0];
    image.alt = story.title;
    image.loading = "lazy";
    link.append(image);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "story-image-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    link.append(placeholder);
  }

  const content = document.createElement("div");
  content.className = "story-card-content";
  const date = document.createElement("p");
  date.className = "story-date";
  date.textContent = formatDate(story.published_at || story.created_at);
  const title = document.createElement("h2");
  title.textContent = story.title;
  const summary = document.createElement("p");
  summary.textContent = story.summary || story.body.split(/\n\s*\n/)[0];
  const readMore = document.createElement("span");
  readMore.className = "text-link";
  readMore.textContent = "Read the story";
  content.append(date, title, summary, readMore);
  link.append(content);
  card.append(link);
  return card;
}

async function loadStories() {
  if (!isSupabaseConfigured) {
    status.remove();
    empty.hidden = false;
    return;
  }

  status.textContent = "Loading recent work…";
  const { data, error } = await supabase
    .from("job_stories")
    .select("title, slug, summary, body, image_urls, published_at, created_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    status.textContent = "We could not load the latest stories right now. Please try again soon.";
    return;
  }

  status.remove();
  if (!data.length) {
    empty.hidden = false;
    return;
  }
  data.forEach((story) => grid.append(makeStoryCard(story)));
}

loadStories();
