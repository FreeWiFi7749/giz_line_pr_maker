// Cloudflare Workers entry point wrapper
// This wraps the Cloudflare Pages adapter to work with Cloudflare Workers
import { fetch } from "./entry.cloudflare-pages";

export default {
  fetch,
};
