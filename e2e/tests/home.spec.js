import { test, expect } from "@playwright/test";

test("has correct page title", async ({ page }) => {
	await page.goto("/", { waitUntil: "domcontentloaded" });

	await expect(page).toHaveTitle("CYF Slack");
});

test("homepage loads successfully", async ({ page }) => {
	await page.goto("/");

	await expect(page.locator("body")).toBeAttached();
});
