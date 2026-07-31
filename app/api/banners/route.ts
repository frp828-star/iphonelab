import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "banners";
const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = String(
      formData.get("title") || ""
    );

    const subtitle = String(
      formData.get("subtitle") || ""
    );

    const buttonText = String(
      formData.get("button_text") || "Shop Now"
    );

    const buttonLink = String(
      formData.get("button_link") || "/shop"
    );

    const active =
      String(formData.get("active")) === "true";

    const imageFile = formData.get("image");

    if (!(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "Banner image is required" },
        { status: 400 }
      );
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (imageFile.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Image must be smaller than 20MB",
        },
        { status: 400 }
      );
    }

    const extension =
      imageFile.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath = `homepage/${fileName}`;

    const buffer = Buffer.from(
      await imageFile.arrayBuffer()
    );

    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET)
        .upload(filePath, buffer, {
          contentType: imageFile.type,
          upsert: false,
        });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } =
      supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

    const imageUrl =
      publicUrlData.publicUrl;

    const { data, error } = await supabase
      .from("banners")
      .insert({
        title,
        subtitle,
        image: imageUrl,
        button_text: buttonText,
        button_link: buttonLink,
        active,
      })
      .select()
      .single();

    if (error) {
      await supabase.storage
        .from(BUCKET)
        .remove([filePath]);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to create banner",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const formData =
      await request.formData();

    const id = Number(
      formData.get("id")
    );

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Banner ID is required",
        },
        { status: 400 }
      );
    }

    const title = String(
      formData.get("title") || ""
    );

    const subtitle = String(
      formData.get("subtitle") || ""
    );

    const buttonText = String(
      formData.get("button_text") ||
        "Shop Now"
    );

    const buttonLink = String(
      formData.get("button_link") ||
        "/shop"
    );

    const active =
      String(formData.get("active")) ===
      "true";

    const imageFile =
      formData.get("image");

    const updateData: Record<
      string,
      unknown
    > = {
      title,
      subtitle,
      button_text: buttonText,
      button_link: buttonLink,
      active,
    };

    let oldImage = "";

    if (
      imageFile instanceof File &&
      imageFile.size > 0
    ) {
      if (
        !imageFile.type.startsWith(
          "image/"
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Only image files are allowed",
          },
          { status: 400 }
        );
      }

      if (
        imageFile.size >
        MAX_IMAGE_SIZE
      ) {
        return NextResponse.json(
          {
            error:
              "Image must be smaller than 20MB",
          },
          { status: 400 }
        );
      }

      const extension =
        imageFile.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const filePath =
        `homepage/${fileName}`;

      const buffer = Buffer.from(
        await imageFile.arrayBuffer()
      );

      const {
        error: uploadError,
      } = await supabase.storage
        .from(BUCKET)
        .upload(
          filePath,
          buffer,
          {
            contentType:
              imageFile.type,
            upsert: false,
          }
        );

      if (uploadError) {
        return NextResponse.json(
          {
            error:
              uploadError.message,
          },
          { status: 500 }
        );
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      updateData.image =
        publicUrlData.publicUrl;

      const {
        data: oldBanner,
      } = await supabase
        .from("banners")
        .select("image")
        .eq("id", id)
        .single();

      oldImage =
        oldBanner?.image || "";
    }

    const {
      data,
      error,
    } = await supabase
      .from("banners")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (oldImage) {
      const marker =
        `/storage/v1/object/public/${BUCKET}/`;

      if (oldImage.includes(marker)) {
        const oldPath =
          oldImage.split(marker)[1];

        if (oldPath) {
          await supabase.storage
            .from(BUCKET)
            .remove([oldPath]);
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to update banner",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const body =
      await request.json();

    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Banner ID is required",
        },
        { status: 400 }
      );
    }

    const {
      data: banner,
      error: findError,
    } = await supabase
      .from("banners")
      .select("image")
      .eq("id", id)
      .single();

    if (findError) {
      return NextResponse.json(
        {
          error:
            findError.message,
        },
        { status: 500 }
      );
    }

    const {
      error,
    } = await supabase
      .from("banners")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (banner?.image) {
      const marker =
        `/storage/v1/object/public/${BUCKET}/`;

      if (
        banner.image.includes(
          marker
        )
      ) {
        const filePath =
          banner.image.split(
            marker
          )[1];

        if (filePath) {
          await supabase.storage
            .from(BUCKET)
            .remove([
              filePath,
            ]);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Banner deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to delete banner",
      },
      { status: 500 }
    );
  }
}