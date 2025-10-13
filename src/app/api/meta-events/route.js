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

    // 4. Log the complete event data for verification
    console.log("Meta CAPI Event Received:", {
      event_id: data.event_id,
      event_name: data.event_name,
      cookies: { _fbc: fbc, _fbp: fbp },
      user_agent: data.user_data?.client_user_agent,
    });

    // 5. Return success response with all collected data
    return NextResponse.json({
      success: true,
      message: "Event received and ready for CAPI",
      event_id: data.event_id,
      event_name: data.event_name,
      cookies: {
        _fbc: fbc,
        _fbp: fbp,
      },
      user_data: data.user_data,
      custom_data: data.custom_data,
      note: "This event is ready to be sent to Meta CAPI with proper deduplication",
    });
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
