import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link");

    const response = await axios.get(link);
    const html = response.data;

    // Try multiple sources for FULL description (in order of priority)
    let description = extractFullDescription(html);

    // Final fallback: truncated meta tag (only if all else fails)
    if (!description) {
      description = extractMetaTagDescription(html);
    }

    // Decode HTML entities if we found something
    if (description && description !== "Description not found") {
      description = decodeHtmlEntities(description);
    }

    return NextResponse.json({
      ok: true,
      data: description || "Description not found",
      source: description ? getDescriptionSource(html, description) : "none",
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({
      ok: false,
      message: error?.message || "Unknown Error",
    });
  }
}

// MAIN FUNCTION: Try multiple sources for FULL description
function extractFullDescription(html) {
  // SOURCE 1: ytInitialPlayerResponse (often has full description)
  const fullDesc1 = extractFromPlayerResponse(html);
  if (fullDesc1) return fullDesc1;

  // SOURCE 2: ytInitialData (alternative JSON structure)
  const fullDesc2 = extractFromYtInitialData(html);
  if (fullDesc2) return fullDesc2;

  // SOURCE 3: Look for "shortDescription" in any JSON
  const fullDesc3 = extractShortDescription(html);
  if (fullDesc3) return fullDesc3;

  return null;
}

// SOURCE 1: ytInitialPlayerResponse - Usually has the most complete description
function extractFromPlayerResponse(html) {
  try {
    const match = html.match(
      /var ytInitialPlayerResponse = ({.*?});<\/script>/s
    );
    if (match) {
      const data = JSON.parse(match[1]);

      // Try multiple possible paths in the JSON
      const paths = [
        data?.videoDetails?.shortDescription,
        data?.microformat?.playerMicroformatRenderer?.description?.simpleText,
        data?.playerOverlays?.playerOverlayRenderer?.videoDetails
          ?.playerOverlayVideoDetailsRenderer?.description?.simpleText,
      ];

      for (const desc of paths) {
        if (desc && desc.trim().length > 0) {
          return desc;
        }
      }
    }
  } catch (e) {
    console.error("Error parsing ytInitialPlayerResponse:", e.message);
  }
  return null;
}

// SOURCE 2: ytInitialData - Alternative JSON structure
function extractFromYtInitialData(html) {
  try {
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (match) {
      const data = JSON.parse(match[1]);

      // Navigate through possible description locations
      const videoPrimaryInfo =
        data?.contents?.twoColumnWatchNextResults?.results?.results
          ?.contents?.[0]?.videoPrimaryInfoRenderer;
      if (videoPrimaryInfo?.description?.simpleText) {
        return videoPrimaryInfo.description.simpleText;
      }

      // Check secondary results
      const secondaryResults =
        data?.contents?.twoColumnWatchNextResults?.secondaryResults
          ?.secondaryResults?.results;
      if (secondaryResults) {
        for (const result of secondaryResults) {
          if (result?.structuredDescription?.content) {
            return result.structuredDescription.content;
          }
          if (result?.expandableVideoDescriptionBodyText?.content) {
            return result.expandableVideoDescriptionBodyText.content;
          }
        }
      }

      // Check metadata
      const metadata = data?.metadata?.videoMetadataRenderer;
      if (metadata?.description?.simpleText) {
        return metadata.description.simpleText;
      }
    }
  } catch (e) {
    console.error("Error parsing ytInitialData:", e.message);
  }
  return null;
}

// SOURCE 3: Search for "shortDescription" in any JSON-LD or script tag
function extractShortDescription(html) {
  try {
    // Look for JSON-LD structured data
    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json">(.*?)<\/script>/s
    );
    if (jsonLdMatch) {
      const jsonLd = JSON.parse(jsonLdMatch[1]);
      if (jsonLd.description && jsonLd.description.length > 100) {
        // Full descriptions are longer
        return jsonLd.description;
      }
    }

    // Search for "shortDescription" pattern in any script
    const shortDescMatch = html.match(/"shortDescription":"(.*?)(?<!\\)"/s);
    if (shortDescMatch && shortDescMatch[1]) {
      return shortDescMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
    }
  } catch (e) {
    console.error("Error extracting shortDescription:", e.message);
  }
  return null;
}

// LAST RESORT: Truncated meta tag description
function extractMetaTagDescription(html) {
  try {
    const ogMatch = html.match(
      /<meta property="og:description" content="(.*?)">/
    );
    const schemaMatch = html.match(
      /<meta itemprop="description" content="(.*?)">/
    );

    return ogMatch ? ogMatch[1] : schemaMatch ? schemaMatch[1] : null;
  } catch (e) {
    console.error("Error extracting meta tag:", e.message);
    return null;
  }
}

// Helper: Decode HTML entities
function decodeHtmlEntities(text) {
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
  };

  return text
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (match) => entities[match])
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}

// Helper: Identify which source we got the description from (for debugging)
function getDescriptionSource(html, description) {
  if (description.includes("...") && description.length < 200)
    return "meta-tag-truncated";
  if (extractFromPlayerResponse(html) === description) return "player-response";
  if (extractFromYtInitialData(html) === description) return "yt-initial-data";
  if (extractShortDescription(html) === description) return "short-description";
  return "unknown";
}
