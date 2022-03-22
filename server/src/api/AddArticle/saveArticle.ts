import Article from "svr/models/Article";
import ApiAddArticlePayload from "./payload";

export default async function savePayload(
  payload: ApiAddArticlePayload,
  userId: number
): Promise<{ success: boolean; message: string }> {
  if (!payload._valid) return { success: false, message: "article pattern wrong" };
  try {
    const article = new Article({
      title: payload.title,
      description: payload.description,
      body: payload.body,
      poster: "",
      userId,
    });

    await article.save();
    return { success: true, message: "article saved" };
  } catch (e) {
    return {
      success: false,
      message: `failed to save article${e instanceof Error && ` :${e.message}`}`,
    };
  }
}
