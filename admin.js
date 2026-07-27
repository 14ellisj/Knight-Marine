import { configurationMessage, isSupabaseConfigured, supabase } from "./supabase-client.js";

const setupNotice = document.querySelector("[data-admin-setup]");
const loginPanel = document.querySelector("[data-login-panel]");
const dashboard = document.querySelector("[data-admin-dashboard]");
const loginForm = document.querySelector("[data-login-form]");
const publishForm = document.querySelector("[data-publish-form]");
const loginStatus = document.querySelector("[data-login-status]");
const publishStatus = document.querySelector("[data-publish-status]");
const recentStories = document.querySelector("[data-admin-stories]");
const signOutButton = document.querySelector("[data-sign-out]");

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

function setStatus(element, message, type = "") {
  element.textContent = message;
  element.className = `form-status ${type}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

function showLogin() {
  loginPanel.hidden = false;
  dashboard.hidden = true;
}

function showDashboard() {
  loginPanel.hidden = true;
  dashboard.hidden = false;
}

async function isAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

function addStoryRow(story) {
  const item = document.createElement("li");
  const title = document.createElement("strong");
  title.textContent = story.title;
  const meta = document.createElement("span");
  meta.textContent = story.published ? "Published" : "Draft";
  item.append(title, meta);
  recentStories.append(item);
}

async function loadAdminStories() {
  recentStories.replaceChildren();
  const { data, error } = await supabase
    .from("job_stories")
    .select("title, published, created_at")
    .order("created_at", { ascending: false })
    .limit(8);
  if (error || !data.length) {
    const item = document.createElement("li");
    item.textContent = "No stories have been added yet.";
    recentStories.append(item);
    return;
  }
  data.forEach(addStoryRow);
}

async function checkSession() {
  if (!isSupabaseConfigured) {
    setupNotice.hidden = false;
    setupNotice.textContent = configurationMessage;
    return;
  }
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    showLogin();
    return;
  }
  if (!(await isAdmin())) {
    await supabase.auth.signOut();
    showLogin();
    setStatus(loginStatus, "This account is not approved to publish Knight Marine stories.", "error");
    return;
  }
  showDashboard();
  loadAdminStories();
}

async function uploadImages(files, storyId, slug) {
  const urls = [];
  for (const [index, file] of [...files].entries()) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`${file.name} is not an image.`);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error(`${file.name} is larger than 6MB. Please resize it for the web before uploading.`);
    }
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `stories/${storyId}/${slug}-${Date.now()}-${index + 1}.${extension}`;
    const { error } = await supabase.storage
      .from("job-story-images")
      .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from("job-story-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector("button[type=submit]");
  button.disabled = true;
  setStatus(loginStatus, "Signing in…");
  const email = loginForm.elements.email.value.trim();
  const password = loginForm.elements.password.value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  button.disabled = false;
  if (error) {
    setStatus(loginStatus, error.message, "error");
    return;
  }
  await checkSession();
});

publishForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = publishForm.querySelector("button[type=submit]");
  const form = publishForm.elements;
  const title = form.title.value.trim();
  const body = form.body.value.trim();
  const summary = form.summary.value.trim();
  const published = form.published.checked;
  const files = form.images.files;
  const slug = `${slugify(title)}-${Date.now().toString().slice(-6)}`;

  if (!title || !body) {
    setStatus(publishStatus, "Please add a title and the main story text.", "error");
    return;
  }
  if (files.length > 10) {
    setStatus(publishStatus, "Please choose no more than ten images for each story.", "error");
    return;
  }
  button.disabled = true;
  setStatus(publishStatus, "Creating your story…");

  const { data: story, error: createError } = await supabase
    .from("job_stories")
    .insert({ title, slug, summary, body, published: false, published_at: null })
    .select("id")
    .single();
  if (createError) {
    button.disabled = false;
    setStatus(publishStatus, createError.message, "error");
    return;
  }

  try {
    const imageUrls = await uploadImages(files, story.id, slug);
    const { error: updateError } = await supabase
      .from("job_stories")
      .update({ image_urls: imageUrls, published, published_at: published ? new Date().toISOString() : null })
      .eq("id", story.id);
    if (updateError) throw updateError;
    publishForm.reset();
    setStatus(publishStatus, published ? "Story published and visible on the website." : "Draft saved. Tick Publish when it is ready for customers.", "success");
    loadAdminStories();
  } catch (error) {
    setStatus(publishStatus, `The story was saved as a private draft, but its images could not be uploaded: ${error.message}`, "error");
  } finally {
    button.disabled = false;
  }
});

signOutButton?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  showLogin();
  setStatus(loginStatus, "Signed out.");
});

checkSession();
