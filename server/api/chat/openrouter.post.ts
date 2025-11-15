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
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: 'OpenRouter API key not configured',
      });
    }

    // Get model name from environment or use default
    // List of free models to try in order
    const freeModels = [
      process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
      'google/gemma-2-9b-it:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'qwen/qwen-2-7b-instruct:free',
    ];
    
    const modelName = freeModels[0];

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

    // Build messages array for OpenRouter API
    const messages: Array<{ role: string; content: string }> = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    // Add conversation history (last 10 messages)
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach((msg: Message) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message,
    });

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://roaya-banking.ly', // Optional: your site URL
        'X-Title': 'Roaya Banking Assistant', // Optional: your app name
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Log detailed error for debugging
      console.error('OpenRouter API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        model: modelName,
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
      });
      
      // Handle specific error codes
      if (response.status === 429) {
        throw createError({
          statusCode: 429,
          message: errorData.error?.message || 'Rate limit exceeded. The free model might be temporarily unavailable. Please try again in a moment.',
        });
      }
      
      if (response.status === 401) {
        throw createError({
          statusCode: 401,
          message: 'Invalid API key. Please check your OPENROUTER_API_KEY in .env file.',
        });
      }
      
      if (response.status === 402) {
        throw createError({
          statusCode: 402,
          message: 'Insufficient credits. Please check your OpenRouter account or use a free model.',
        });
      }
      
      throw createError({
        statusCode: response.status,
        message: errorData.error?.message || `OpenRouter API error: ${response.statusText}`,
      });
    }

    const data = await response.json();

    // Extract AI response
    const aiMessage = data.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من الرد.';

    // Return formatted response with message and timestamp
    return {
      message: aiMessage,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    // Log error for debugging
    console.error('OpenRouter API error:', error);

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

    // Handle API key errors
    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
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
