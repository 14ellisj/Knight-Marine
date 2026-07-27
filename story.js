import { isSupabaseConfigured, supabase } from "./supabase-client.js";

const article = document.querySelector("[data-story-article]");
const status = document.querySelector("[data-story-status]");
const title = document.querySelector("[data-story-title]");
const date = document.querySelector("[data-story-date]");
const summary = document.querySelector("[data-story-summary]");
const body = document.querySelector("[data-story-body]");
const gallery = document.querySelector("[data-story-gallery]");

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function addParagraphs(copy) {
  copy
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .forEach((paragraph) => {
      const item = document.createElement("p");
      item.textContent = paragraph;
      body.append(item);
    });
}

async function loadStory() {
  const slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug) {
    status.textContent = "Choose a story from the latest work page to read more.";
    return;
  }
  if (!isSupabaseConfigured) {
    status.textContent = "This story is not available yet. Please return to the latest job stories page.";
    return;
  }

  status.textContent = "Loading story…";
  const { data: story, error } = await supabase
    .from("job_stories")
    .select("title, slug, summary, body, image_urls, published_at, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !story) {
    status.textContent = "This story is not available. It may still be in draft or the link may be out of date.";
    return;
  }

  document.title = `${story.title} | Knight Marine Stories`;
  const storyUrl = `${window.location.origin}${window.location.pathname}?slug=${encodeURIComponent(story.slug)}`;
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', storyUrl);
  document.querySelector('meta[name="description"]')?.setAttribute('content', story.summary || story.body.slice(0, 155));
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${story.title} | Knight Marine Stories`);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', story.summary || story.body.slice(0, 155));
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', storyUrl);
  title.textContent = story.title;
  date.textContent = formatDate(story.published_at || story.created_at);
  summary.textContent = story.summary || "";
  addParagraphs(story.body);

  story.image_urls?.forEach((url, index) => {
    const image = document.createElement("img");
    image.src = url;
    image.alt = `${story.title} — image ${index + 1}`;
    image.loading = index > 0 ? "lazy" : "eager";
    gallery.append(image);
  });

  status.remove();
  article.hidden = false;
}

loadStory();
