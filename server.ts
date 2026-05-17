import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limit for image uploads
app.use(express.json({ limit: '10mb' }));

// Gemini Initialization
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/analyze", async (req, res) => {
  try {
    const { image } = req.body; // base64 string

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const base64Data = image.split(",")[1] || image;
    
    // The prompt provided in the user request
    const prompt = `
너는 전문 퍼스널컬러 컨설턴트이자 이미지 분석 전문가야.

사용자가 업로드한 얼굴 사진을 바탕으로 퍼스널컬러를 분석해줘. 단, 사진의 조명, 화장, 필터, 카메라 색감에 따라 결과가 달라질 수 있으므로 최종 진단이 아니라 참고용 분석으로 안내해줘.

분석할 항목은 다음과 같아.

1. 피부 톤
- 밝기
- 노란기 / 붉은기 / 푸른기
- 맑은 느낌인지, 차분한 느낌인지

2. 전체 인상
- 얼굴의 명도
- 채도
- 대비감
- 부드러운 이미지인지, 선명한 이미지인지

3. 웜톤 / 쿨톤 판단
- 웜톤에 가까운지
- 쿨톤에 가까운지
- 중립톤 가능성이 있는지

4. 4계절 퍼스널컬러 추천
다음 중 가장 가까운 타입을 추천해줘.
- 봄 웜톤
- 여름 쿨톤
- 가을 웜톤
- 겨울 쿨톤

가능하다면 세부 타입도 함께 추천해줘.
예:
- 봄 웜 라이트
- 봄 웜 브라이트
- 여름 쿨 라이트
- 여름 쿨 뮤트
- 가을 웜 뮤트
- 가을 웜 딥
- 겨울 쿨 브라이트
- 겨울 쿨 딥

5. 추천 컬러
- 잘 어울리는 색상 8개
- 피하면 좋은 색상 5개
- 추천 립 컬러
- 추천 블러셔 컬러
- 추천 헤어 컬러
- 추천 의류 컬러

6. 결과 설명
사용자가 쉽게 이해할 수 있도록 친절하고 자연스럽게 설명해줘.
너무 단정적으로 말하지 말고, “사진상으로는”, “현재 이미지 기준으로는”, “가까워 보여요” 같은 표현을 사용해줘.

7. 출력 형식
아래 JSON 형식으로만 답변해줘. 마크다운, 설명 문장, 코드블록은 사용하지 마.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Data } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disclaimer: { type: Type.STRING },
            summary: { type: Type.STRING },
            tone_direction: { type: Type.STRING },
            season_type: { type: Type.STRING },
            sub_type: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            analysis: {
              type: Type.OBJECT,
              properties: {
                skin_tone: { type: Type.STRING },
                brightness: { type: Type.STRING },
                saturation: { type: Type.STRING },
                contrast: { type: Type.STRING },
                overall_impression: { type: Type.STRING }
              }
            },
            recommended_colors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            },
            avoid_colors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            },
            makeup_recommendations: {
              type: Type.OBJECT,
              properties: {
                lip: { type: Type.ARRAY, items: { type: Type.STRING } },
                blush: { type: Type.ARRAY, items: { type: Type.STRING } },
                eyeshadow: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            hair_recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            fashion_recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            style_tip: { type: Type.STRING },
            photo_quality_note: { type: Type.STRING }
          },
          required: ["summary", "tone_direction", "season_type", "sub_type", "recommended_colors"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Analysis failed:", error);
    res.status(500).json({ error: error.message || "Failed to analyze image" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
