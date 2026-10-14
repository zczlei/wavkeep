import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/** Same OpenNext setup as savemov: no R2 incremental cache. */
export default defineCloudflareConfig({});
