// services/imageFilter.ts
import axios from "axios";
import FormData from "form-data";

export type SafeSearchResult = {
  safe: boolean;
  reason?: string;
};

export async function validateImageNSFW(
  imageBuffer: Buffer
): Promise<SafeSearchResult> {
  return { safe: true, reason: "ok" };
  // --- Opciones ---
  // 1️⃣ DeepAI NSFW detector (gratuito para pruebas)
  //   const form = new FormData();
  //   form.append("image", imageBuffer, { filename: "upload.jpg" });
  //   try {
  //     const response = await axios.post(
  //       "https://api.deepai.org/api/nsfw-detector",
  //       form,
  //       {
  //         headers: {
  //           "Api-Key": process.env.DEEPAI_API_KEY!,
  //           ...form.getHeaders(),
  //         },
  //       }
  //     );

  //     const output = response.data.output[0]; // DeepAI devuelve probabilidades de NSFW
  //     const isSafe = output.nsfw_score < 0.5; // threshold ajustable

  //     return isSafe
  //       ? { safe: true }
  //       : { safe: false, reason: "Contenido NSFW detectado" };
  //   } catch (error: Error | any) {
  //     console.error("Error al verificar imagen:", error.message);
  //     return { safe: false, reason: "No se pudo verificar la imagen" };
  //   }

  // 2️⃣ En producción podés reemplazar todo por Google Vision:
  // const [result] = await visionClient.safeSearchDetection(imageBuffer);
  // const safe = result.safeSearchAnnotation;
  // if (safe.adult === "LIKELY" || safe.violence === "VERY_LIKELY") ...
}
