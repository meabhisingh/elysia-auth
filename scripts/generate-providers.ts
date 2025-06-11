// scripts/generate-provider-stubs.ts
import fs from "fs";
import path from "path";

const rawProviders = `
// export { default as _42School } from "@auth/core/providers/42-school";
// export { default as Apple } from "@auth/core/providers/apple";
// export { default as Asgardeo } from "@auth/core/providers/asgardeo";
// export { default as Auth0 } from "@auth/core/providers/auth0";
// export { default as Authentik } from "@auth/core/providers/authentik";
// export { default as AzureADB2C } from "@auth/core/providers/azure-ad-b2c"; // Note: renamed to match common casing
// export { default as AzureAD } from "@auth/core/providers/azure-ad";
// export { default as AzureDevOps } from "@auth/core/providers/azure-devops";
// export { default as BankIDNorge } from "@auth/core/providers/bankid-no";
// export { default as Battlenet } from "@auth/core/providers/battlenet";
// export { default as Beyondidentity } from "@auth/core/providers/beyondidentity";
// export { default as Bitbucket } from "@auth/core/providers/bitbucket";
// export { default as Box } from "@auth/core/providers/box";
// export { default as BoxyHQSAML } from "@auth/core/providers/boxyhq-saml"; // Note: renamed
// export { default as Bungie } from "@auth/core/providers/bungie";
// export { default as ClickUp } from "@auth/core/providers/click-up";
// export { default as Cognito } from "@auth/core/providers/cognito";
// export { default as Coinbase } from "@auth/core/providers/coinbase";
// export { default as Credentials } from "@auth/core/providers/credentials";
// export { default as Descope } from "@auth/core/providers/descope";
// export { default as Discord } from "@auth/core/providers/discord";
// export { default as Dribbble } from "@auth/core/providers/dribbble";
// export { default as Dropbox } from "@auth/core/providers/dropbox";
// export { default as DuendeIdentityServer6 } from "@auth/core/providers/duende-identity-server6"; // Note: renamed
// export { default as Eveonline } from "@auth/core/providers/eveonline";
// export { default as Facebook } from "@auth/core/providers/facebook";
// export { default as Faceit } from "@auth/core/providers/faceit";
// export { default as Figma } from "@auth/core/providers/figma";
// export { default as ForwardEmail } from "@auth/core/providers/forwardemail"; // Note: renamed
// export { default as Foursquare } from "@auth/core/providers/foursquare";
// export { default as Freshbooks } from "@auth/core/providers/freshbooks";
// export { default as Frontegg } from "@auth/core/providers/frontegg";
// export { default as FusionAuth } from "@auth/core/providers/fusionauth";
// export { default as GitHub } from "@auth/core/providers/github"; // Note: renamed
// export { default as GitLab } from "@auth/core/providers/gitlab"; // Note: renamed
// export { default as Google } from "@auth/core/providers/google";
// export { default as Hubspot } from "@auth/core/providers/hubspot";
// export { default as IdentityServer4 } from "@auth/core/providers/identity-server4"; // Note: renamed
// export { default as Instagram } from "@auth/core/providers/instagram";
// export { default as Kakao } from "@auth/core/providers/kakao";
// export { default as Keycloak } from "@auth/core/providers/keycloak";
// export { default as Line } from "@auth/core/providers/line";
// export { default as LinkedIn } from "@auth/core/providers/linkedin";
// export { default as Logto } from "@auth/core/providers/logto";
// export { default as Loops } from "@auth/core/providers/loops";
// export { default as Mailchimp } from "@auth/core/providers/mailchimp";
// export { default as Mailgun } from "@auth/core/providers/mailgun";
// export { default as Mailru } from "@auth/core/providers/mailru";
// export { default as Mastodon } from "@auth/core/providers/mastodon";
// export { default as Mattermost } from "@auth/core/providers/mattermost";
// export { default as Medium } from "@auth/core/providers/medium";
// export { default as MicrosoftEntraID } from "@auth/core/providers/microsoft-entra-id";
// export { default as Naver } from "@auth/core/providers/naver";
// export { default as Netlify } from "@auth/core/providers/netlify";
// export { default as Netsuite } from "@auth/core/providers/netsuite";
// export { default as Nextcloud } from "@auth/core/providers/nextcloud";
// export { default as Nodemailer } from "@auth/core/providers/nodemailer";
// export { default as Notion } from "@auth/core/providers/notion";
// export { default as Okta } from "@auth/core/providers/okta";
// export { default as OneLogin } from "@auth/core/providers/onelogin";
// export { default as Osso } from "@auth/core/providers/osso";
// export { default as Osu } from "@auth/core/providers/osu";
// export { default as Passage } from "@auth/core/providers/passage";
// export { default as Passkey } from "@auth/core/providers/passkey";
// export { default as Patreon } from "@auth/core/providers/patreon";
// export { default as Pinterest } from "@auth/core/providers/pinterest";
// export { default as Pipedrive } from "@auth/core/providers/pipedrive";
// export { default as Postmark } from "@auth/core/providers/postmark";
// export { default as Reddit } from "@auth/core/providers/reddit";
// export { default as Resend } from "@auth/core/providers/resend";
// export { default as Salesforce } from "@auth/core/providers/salesforce";
// export { default as Sendgrid } from "@auth/core/providers/sendgrid";
// export { default as SimpleLogin } from "@auth/core/providers/simplelogin";
// export { default as Slack } from "@auth/core/providers/slack";
// export { default as Spotify } from "@auth/core/providers/spotify";
// export { default as Strava } from "@auth/core/providers/strava";
// export { default as Threads } from "@auth/core/providers/threads";
// export { default as Tiktok } from "@auth/core/providers/tiktok";
// export { default as Todoist } from "@auth/core/providers/todoist";
// export { default as Trakt } from "@auth/core/providers/trakt";
// export { default as Twitch } from "@auth/core/providers/twitch";
// export { default as Twitter } from "@auth/core/providers/twitter";
// export { default as UnitedEffects } from "@auth/core/providers/united-effects";
// export { default as VippsMobilePay } from "@auth/core/providers/vipps";
// export { default as Vk } from "@auth/core/providers/vk";
// export { default as Webex } from "@auth/core/providers/webex";
// export { default as Wikimedia } from "@auth/core/providers/wikimedia";
// export { default as WordPress } from "@auth/core/providers/wordpress";
// export { default as WorkOS } from "@auth/core/providers/workos";
// export { default as Yandex } from "@auth/core/providers/yandex";
// export { default as Zitadel } from "@auth/core/providers/zitadel";
// export { default as Zoho } from "@auth/core/providers/zoho";
// export { default as Zoom } from "@auth/core/providers/zoom";

`;

const providers = rawProviders.split("\n").filter(Boolean);

const outputDir = path.resolve("src/providers");
fs.mkdirSync(outputDir, { recursive: true });

for (const line of providers) {
  const match = line.match(/from "@auth\/core\/providers\/(.+)";/);
  if (!match) continue;

  const providerPath = match[1]; // e.g., google
  const filename = path.join(outputDir, `${providerPath}.ts`);
  const content = `export { default } from "@auth/core/providers/${providerPath}";\n`;
  fs.writeFileSync(filename, content);
}

console.log("✅ Provider proxy files generated.");
