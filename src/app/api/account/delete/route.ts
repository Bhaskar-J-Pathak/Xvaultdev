import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createServiceClient } from "@/lib/auth";

export async function DELETE() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // Delete user profile first (FK cascade should handle related data)
  await supabase.from("profiles").delete().eq("id", user.id);

  // Delete auth user
  const { error } = await supabase.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
