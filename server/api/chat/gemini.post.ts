import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatRequest {
  message: string;
  sessionId: string;
  locale: string;
  conversationHistory: Message[];
}

interface GeminiModelApiResponse {
  models?: Array<{
    name?: string;
    displayName?: string;
    supportedGenerationMethods?: string[];
  }>;
}

interface AvailableGeminiModel {
  rawName: string;
  normalizedName: string;
  displayName?: string;
  supportedGenerationMethods: string[];
  supportsGenerateContent: boolean;
}

const normalizeModelName = (name?: string | null) => {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return name.replace(/^models\//i, '').trim();
};

const supportsGenerateContent = (methods?: string[]) => {
  if (!Array.isArray(methods) || methods.length === 0) {
    return true;
  }
  return methods.some((method) => method?.toLowerCase().includes('generatecontent'));
};

const buildModelLabel = (model?: AvailableGeminiModel) => model?.displayName || model?.rawName || model?.normalizedName;

async function fetchAvailableGeminiModels(apiKey: string): Promise<AvailableGeminiModel[]> {
  const fetchFn = (globalThis as Record<string, any>).fetch as ((input: string) => Promise<any>) | undefined;

  if (!fetchFn) {
    console.warn('Global fetch is not available; skipping Gemini model discovery.');
    return [];
  }

  try {
    const url = new URL('https://generativelanguage.googleapis.com/v1beta/models');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('pageSize', '200');

    const response = await fetchFn(url.toString());
    if (!response?.ok) {
      throw new Error(`ListModels failed with status ${response?.status}`);
    }

    const payload = (await response.json()) as GeminiModelApiResponse;
    return (payload.models || [])
      .map((model) => {
        const normalizedName = normalizeModelName(model.name);
        if (!normalizedName) {
          return null;
        }

        return {
          rawName: model.name as string,
          normalizedName,
          displayName: model.displayName,
          supportedGenerationMethods: model.supportedGenerationMethods || [],
          supportsGenerateContent: supportsGenerateContent(model.supportedGenerationMethods),
        };
      })
      .filter((model): model is AvailableGeminiModel => Boolean(model));
  } catch (error) {
    console.warn('Could not list Gemini models:', error);
    return [];
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody<ChatRequest>(event);
    const { message, sessionId, locale, conversationHistory } = body;

    // Validate request body
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw createError({
        statusCode: 400,
        message: 'Invalid message: message is required and must be a non-empty string',
      });
    }

    if (!sessionId || typeof sessionId !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Invalid sessionId: sessionId is required and must be a string',
      });
    }

    if (!locale || typeof locale !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Invalid locale: locale is required and must be a string',
      });
    }

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: 'Gemini API key not configured',
      });
    }

    // Initialize GoogleGenerativeAI with API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get model name from environment or use default
    const configuredModel = process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-flash';
    const normalizedConfiguredModel = normalizeModelName(configuredModel) || 'gemini-1.5-flash';
    const preferredModelCandidates = Array.from(
      new Set(
        [
          normalizedConfiguredModel,
          normalizeModelName(process.env.GEMINI_CHAT_MODEL),
          'gemini-1.5-flash-latest',
          'gemini-1.0-pro',
          'gemini-1.0-pro-latest',
          'gemini-pro',
          'gemini-pro-latest',
        ].filter(Boolean),
      ),
    );

    const availableModels = await fetchAvailableGeminiModels(apiKey);
    let modelName = preferredModelCandidates[0] || 'gemini-1.0-pro';

    if (availableModels.length > 0) {
      const matchingPreferred = preferredModelCandidates
        .map((candidate) => availableModels.find((model) => model.normalizedName === candidate && model.supportsGenerateContent))
        .find((model): model is AvailableGeminiModel => Boolean(model));

      if (matchingPreferred) {
        modelName = matchingPreferred.normalizedName;
      } else {
        const fallbackFromList = availableModels.find((model) => model.supportsGenerateContent) || availableModels[0];
        if (fallbackFromList && fallbackFromList.normalizedName !== modelName) {
          const reason = availableModels.some((model) => model.normalizedName === normalizedConfiguredModel)
            ? 'does not support generateContent'
            : 'is unavailable';
          console.warn(
            `Configured Gemini model '${configuredModel}' ${reason}. Falling back to '${buildModelLabel(fallbackFromList)}'.`,
          );
          modelName = fallbackFromList.normalizedName;
        }
      }
    }

    if (!modelName) {
      modelName = 'gemini-1.0-pro';
    }

    const model = genAI.getGenerativeModel({ model: modelName });

    // Build system prompt based on locale
    const systemPrompt = locale === 'ar'
      ? `أنت مساعد ذكي لمنصة رؤية المصرفية التابعة لمصرف اليقين في ليبيا.

## دورك:
- مساعدة المستخدمين في فهم واستخدام منصة رؤية المصرفية
- الإجابة على الاستفسارات بوضوح وبشكل مهني
- تقديم إرشادات خطوة بخطوة عند الحاجة

## الصفحات المتاحة في المنصة:

### 1. صفحة دعم المشاريع (Beneficiaries)
- عرض المشاريع الخيرية والتعليمية والصحية والبنية التحتية
- البحث والفلترة حسب النوع، الفئة، المدينة، والوسوم
- دعم المشاريع عبر التحويل المالي
- عرض تفاصيل المشروع: الهدف المالي، المبلغ المحصل، التقدم
- إضافة المشاريع للمفضلة
- التحقق من صحة IBAN

### 2. صفحة مواقع ماكينات الصراف الآلي (ATM Locations)
- عرض مواقع ماكينات الصراف الآلي لمصرف اليقين على الخريطة
- البحث حسب الاسم، البنك، أو الموقع
- الفلترة حسب الحالة (متاحة/غير متاحة)
- عرض الماكينات المتاحة 24 ساعة
- عرض الماكينات التي تدعم ذوي الاحتياجات الخاصة
- تحديد الماكينات القريبة من موقع المستخدم
- الحصول على اتجاهات القيادة عبر خرائط جوجل

### 3. صفحة نقاط البيع (POS & NPG Locations)
- عرض المتاجر والمحلات التي تقبل الدفع الإلكتروني
- البحث حسب اسم المتجر أو العنوان
- الفلترة حسب نوع الخدمة (POS، NPG، أو كلاهما)
- الفلترة حسب المدينة
- عرض المتاجر القريبة من موقع المستخدم
- معلومات عن البطاقات المقبولة (Visa، Mastercard)
- تصدير البيانات بصيغة CSV

## إرشادات الإجابة:
- كن مهذبًا ومحترمًا ومهنيًا
- قدم إجابات واضحة ومختصرة
- إذا سأل المستخدم عن ميزة غير موجودة، اقترح البدائل المتاحة
- عند الشرح، استخدم خطوات مرقمة للوضوح
- استخدم الرموز التعبيرية بشكل معتدل لجعل الإجابات أكثر ودية`
      : `You are an AI assistant for Ro'ya Banking Platform by Al-Yaqeen Bank in Libya.

## Your Role:
- Help users understand and use the Ro'ya Banking Platform
- Answer inquiries clearly and professionally
- Provide step-by-step guidance when needed

## Available Platform Pages:

### 1. Project Support Page (Beneficiaries)
- Display charitable, educational, health, and infrastructure projects
- Search and filter by type, category, city, and tags
- Support projects through financial transfers
- View project details: financial goal, collected amount, progress
- Add projects to favorites
- IBAN validation

### 2. ATM Locations Page
- Display Al-Yaqeen Bank ATM locations on map
- Search by name, bank, or location
- Filter by status (available/unavailable)
- Show 24-hour ATMs
- Show accessible ATMs for people with disabilities
- Find nearby ATMs based on user location
- Get driving directions via Google Maps

### 3. POS & NPG Locations Page
- Display stores accepting electronic payments
- Search by store name or address
- Filter by service type (POS, NPG, or both)
- Filter by city
- Show nearby stores based on user location
- Information about accepted cards (Visa, Mastercard)
- Export data as CSV

## Response Guidelines:
- Be polite, respectful, and professional
- Provide clear and concise answers
- If asked about unavailable features, suggest available alternatives
- Use numbered steps for clarity when explaining
- Use emojis moderately to make responses friendly`;

    // Build conversation context with last 10 messages
    let conversationContext = systemPrompt + '\n\n';
    
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationContext += 'Previous conversation:\n';
      const recentHistory = conversationHistory.slice(-10);
      
      recentHistory.forEach((msg: Message) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationContext += `${role}: ${msg.content}\n`;
      });
    }
    
    conversationContext += `\nUser: ${message}\nAssistant:`;

    // Generate AI response using model.generateContent()
    let aiMessage = '';
    try {
      const result = await model.generateContent(conversationContext);
      const response = result.response;
      aiMessage = response.text();
    } catch (e: any) {
      // If the chosen model doesn't support the generateContent endpoint (404), try fallback models.
      console.warn('generateContent failed, attempting fallback models:', e?.message || e);
      const isNotFound = (e?.message || '').toLowerCase().includes('not found') || e?.status === 404 || e?.statusCode === 404;

      // Build a fallback candidates list: prefer any availableModels from listModels, otherwise try common Gemini/bison model names
      const fallbackCandidates: string[] = [];
      if (availableModels.length > 0) {
        const generativeModels = availableModels.filter((model) => model.supportsGenerateContent);
        const otherModels = availableModels.filter((model) => !model.supportsGenerateContent);
        fallbackCandidates.push(...generativeModels.map((model) => model.normalizedName));
        fallbackCandidates.push(...otherModels.map((model) => model.normalizedName));
      }

      // Add a short static list of commonly available model names as a last resort
      fallbackCandidates.push(
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.0-pro',
        'gemini-1.0-pro-latest',
        'gemini-pro',
        'gemini-pro-latest',
        'chat-bison-001',
        'chat-bison',
        'text-bison-001',
        'bison'
      );

      // Remove duplicates and the original modelName
      const tried = new Set<string>([modelName]);
      const candidates = fallbackCandidates
        .map((candidate) => normalizeModelName(candidate))
        .filter((candidate): candidate is string => Boolean(candidate) && !tried.has(candidate));

      if (!isNotFound) {
        // If error is not a not-found/unsupported-model error, rethrow
        throw e;
      }

      let success = false;
      for (const candidate of candidates) {
        try {
          console.warn(`Attempting fallback model: ${candidate}`);
          const fallbackModel = genAI.getGenerativeModel({ model: candidate });
          const retryResult = await fallbackModel.generateContent(conversationContext);
          aiMessage = retryResult.response.text();
          success = true;
          console.warn(`Succeeded with fallback model: ${candidate}`);
          break;
        } catch (innerErr) {
          console.warn(`Fallback model '${candidate}' failed:`, innerErr?.message || innerErr);
          // continue to next candidate
        }
      }

      if (!success) {
        // none of the fallbacks worked — rethrow the original error for upstream handling
        throw e;
      }
    }

    // Return formatted response with message and timestamp
    return {
      message: aiMessage,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    // Log error for debugging
    console.error('Gemini API error:', error);

    // Handle different error types
    if (error.statusCode) {
      // Re-throw errors we already created
      throw error;
    }

    // Handle timeout scenarios
    if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      throw createError({
        statusCode: 504,
        message: 'Request timed out. Please try again.',
      });
    }

    // Handle Gemini API specific errors
    if (error.message?.includes('API key')) {
      throw createError({
        statusCode: 500,
        message: 'API configuration error',
      });
    }

    // Generic error handler
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to process chat request',
    });
  }
});
