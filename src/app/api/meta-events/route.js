// app/api/meta-events/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // 1. Get the data sent from your website's front-end
    const data = await request.json();

    // 2. Validate that event_id is present (critical for deduplication)
    if (!data.event_id) {
      return NextResponse.json(
        {
          success: false,
          message: "event_id is required for deduplication",
        },
        { status: 400 }
      );
    }

    // 3. Read Meta Pixel cookies from the request
    const cookieStore = await cookies();

    // Extract _fbc and _fbp cookies with error handling
    const fbc = cookieStore.get("_fbc")?.value || null;
    const fbp = cookieStore.get("_fbp")?.value || null;

    // Warn if cookies are missing (common for first-time visitors)
    if (!fbc && !fbp) {
      console.warn(
        "⚠️ Meta Pixel cookies (_fbc, _fbp) are missing. This is normal for first-time visitors or if cookies are blocked. Event will still be sent with IP and user agent."
      );
    }

    // 3.5. Extract client IP address from request headers
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      null;

    // 4. Log the complete event data for verification
    console.log("Meta CAPI Event Received:", {
      event_id: data.event_id,
      event_name: data.event_name,
      cookies: { _fbc: fbc, _fbp: fbp },
      client_ip: clientIp,
      user_agent: data.user_data?.client_user_agent,
    });

    // 5. Retrieve Meta credentials from environment variables
    const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const PIXEL_ID = process.env.PIXEL_ID;

    // Validate credentials are present
    if (!META_ACCESS_TOKEN || !PIXEL_ID) {
      console.error("Missing Meta credentials in environment variables");
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error: Missing Meta credentials",
        },
        { status: 500 }
      );
    }

    // 6. Construct the Meta CAPI payload
    const capiPayload = {
      data: [
        {
          event_name: data.event_name,
          event_time: Math.floor(Date.now() / 1000), // Current time in seconds since epoch
          event_source_url: data.event_source_url,
          action_source: "website",
          event_id: data.event_id, // Critical for deduplication
          user_data: {
            // Only include non-null values to satisfy Meta's requirements
            ...(fbc && { fbc: fbc }),
            ...(fbp && { fbp: fbp }),
            ...(data.user_data?.client_user_agent && {
              client_user_agent: data.user_data.client_user_agent,
            }),
            ...(clientIp && { client_ip_address: clientIp }),
          },
          custom_data: data.custom_data || {},
        },
      ],
    };

    // 7. Construct the Meta Graph API URL
    const metaApiUrl = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`;

    // 7.5. Add test event code if in testing mode (REMOVE THIS AFTER TESTING!)
    const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || null;
    if (TEST_EVENT_CODE) {
      console.log("🧪 Running in TEST MODE with code:", TEST_EVENT_CODE);
    }

    // 8. Send the event to Meta Conversions API
    const metaResponse = await fetch(metaApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...capiPayload,
        test_event_code: TEST_EVENT_CODE, // Will be undefined/ignored in production
      }),
    });

    const metaResult = await metaResponse.json();

    // 9. Log the Meta API response
    console.log("Meta CAPI Response:", {
      status: metaResponse.status,
      result: metaResult,
    });

    // 10. Return response based on Meta API result
    if (metaResponse.ok) {
      return NextResponse.json({
        success: true,
        message: "Event successfully sent to Meta CAPI",
        event_id: data.event_id,
        event_name: data.event_name,
        meta_response: metaResult,
        events_received: metaResult.events_received || 0,
      });
    } else {
      // Meta API returned an error
      console.error("Meta CAPI Error:", metaResult);
      return NextResponse.json(
        {
          success: false,
          message: "Meta CAPI request failed",
          error: metaResult.error || metaResult,
        },
        { status: metaResponse.status }
      );
    }
  } catch (error) {
    // Handle any errors that occur during processing
    console.error("Error processing Meta Pixel event:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
