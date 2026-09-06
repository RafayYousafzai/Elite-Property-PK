import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deleteMultipleFromR2 } from "@/lib/r2";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient(cookies());

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient(cookies());

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("properties")
      .update(body)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0]);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient(cookies());

  try {
    const { data: propToDelete } = await supabase
      .from("properties")
      .select("images, image_paths, photo_sphere")
      .eq("id", id)
      .single();

    if (propToDelete) {
      const keysToDelete: string[] = [];
      const rawPaths =
        propToDelete.image_paths && Array.isArray(propToDelete.image_paths) && propToDelete.image_paths.length > 0
          ? propToDelete.image_paths
          : Array.isArray(propToDelete.images)
          ? propToDelete.images
          : [];

      rawPaths.forEach((img: any) => {
        const path = typeof img === "string" ? img : img?.src || img?.url || img?.path;
        if (path) keysToDelete.push(path);
      });

      if (propToDelete.photo_sphere) {
        keysToDelete.push(propToDelete.photo_sphere);
      }

      if (keysToDelete.length > 0) {
        await deleteMultipleFromR2(keysToDelete);
      }
    }

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
