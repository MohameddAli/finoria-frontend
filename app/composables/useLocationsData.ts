import { ref } from 'vue';
import type { Ref } from 'vue';

const ATM_IMAGE_URL = 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=900&h=600&fit=crop&q=85';

const COASTAL_CITY_HINTS = ['طرابلس', 'تاجوراء', 'جنزور', 'قرقارش', 'باب بن غشير', 'ابوسليم'];
const COASTAL_LAT_THRESHOLD = 32.87;
const COASTAL_LNG_RANGE: [number, number] = [12.9, 13.4];
const COASTAL_LAT_DELTA = 0.018;
const COASTAL_LNG_BASE_DELTA = 0.006;

export interface PromoHighlight {
  title: string;
  description?: string;
  badge?: string;
  accent?: string;
}

export interface LocationPoint {
  id: string;
  type: 'atm' | 'pos';
  name: string;
  bank: string;
  address: string;
  city?: string;
  lat: number;
  lng: number;
  status: 'available' | 'unavailable';
  available24h: boolean;
  accessible?: boolean;
  services?: string[];
  image?: string;
  phone?: string;
  distanceKm?: number | null;
  promo?: PromoHighlight;
  merchant?: string;
}

const RAW_LOCATIONS: LocationPoint[] = [
  {
    id: '1',
    type: 'atm',
    name: 'صراف اليقين - الفرع الرئيسي',
    bank: 'مصرف اليقين',
    address: 'شارع عمر المختار',
    city: 'طرابلس',
    lat: 32.8872,
    lng: 13.1913,
    status: 'available',
    available24h: true,
    accessible: true,
    image: ATM_IMAGE_URL,
    phone: '+218-21-1234567'
  },
  {
    id: '2',
    type: 'atm',
    name: 'صراف اليقين - سوق الجمعة',
    bank: 'مصرف اليقين',
    address: 'سوق الجمعة',
    city: 'طرابلس',
    lat: 32.8651,
    lng: 13.1876,
    status: 'available',
    available24h: false,
    accessible: false,
    image: ATM_IMAGE_URL
  },
  {
    id: '3',
    type: 'atm',
    name: 'صراف اليقين - فرع الظهرة',
    bank: 'مصرف اليقين',
    address: 'شارع الظهرة',
    city: 'بنغازي',
    lat: 32.1165,
    lng: 20.0686,
    status: 'available',
    available24h: true,
    accessible: true,
    image: ATM_IMAGE_URL
  },
  {
    id: '4',
    type: 'atm',
    name: 'صراف اليقين - وسط المدينة',
    bank: 'مصرف اليقين',
    address: 'شارع جمال عبد الناصر',
    city: 'بنغازي',
    lat: 32.1190,
    lng: 20.0810,
    status: 'available',
    available24h: false,
    accessible: false,
    image: ATM_IMAGE_URL
  },
  {
    id: '5',
    type: 'atm',
    name: 'صراف اليقين - المطار الدولي',
    bank: 'مصرف اليقين',
    address: 'مطار طرابلس الدولي',
    city: 'طرابلس',
    lat: 32.6635,
    lng: 13.1590,
    status: 'available',
    available24h: true,
    accessible: true,
    image: ATM_IMAGE_URL
  },
  {
    id: '6',
    type: 'atm',
    name: 'صراف اليقين - شارع الفاتح',
    bank: 'مصرف اليقين',
    address: 'شارع الفاتح',
    city: 'مصراتة',
    lat: 32.3754,
    lng: 15.0925,
    status: 'unavailable',
    available24h: false,
    accessible: false,
    image: ATM_IMAGE_URL
  },
  {
    id: '7',
    type: 'atm',
    name: 'صراف اليقين - كورنيش بنغازي',
    bank: 'مصرف اليقين',
    address: 'كورنيش بنغازي',
    city: 'بنغازي',
    lat: 32.1074,
    lng: 20.0640,
    status: 'available',
    available24h: true,
    accessible: true,
    image: ATM_IMAGE_URL
  },
  {
    id: '8',
    type: 'atm',
    name: 'صراف اليقين - مدينة سبها',
    bank: 'مصرف اليقين',
    address: 'وسط مدينة سبها',
    city: 'سبها',
    lat: 27.0377,
    lng: 14.4283,
    status: 'available',
    available24h: false,
    accessible: false,
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-municipality-abuslim',
    type: 'atm',
    name: 'ATM – المجلس البلدي ابوسليم',
    bank: 'مصرف اليقين',
    address: 'ابوسليم',
    city: 'طرابلس',
    lat: 32.8680379,
    lng: 13.1660046,
    status: 'unavailable',
    available24h: true,
    accessible: true,
    services: ['الإيداع النقدي', 'السحب النقدي', 'السحب بدون بطاقة'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-gargaresh',
    type: 'atm',
    name: 'ATM – قرقارش',
    bank: 'مصرف اليقين',
    address: 'قرقارش',
    city: 'طرابلس',
    lat: 32.8652184,
    lng: 13.1074416,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['الإيداع النقدي', 'السحب النقدي', 'السحب بدون بطاقة'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-misurata-branch',
    type: 'atm',
    name: 'ATM – فرع مصراتة',
    bank: 'مصرف اليقين',
    address: 'مصراتة',
    city: 'مصراتة',
    lat: 32.3756161,
    lng: 15.0837712,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['السحب النقدي'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-bab-benghashir',
    type: 'atm',
    name: 'ATM – فرع باب بن غشير',
    bank: 'مصرف اليقين',
    address: 'باب بن غشير',
    city: 'طرابلس',
    lat: 32.8688393,
    lng: 13.1960908,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['السحب النقدي', 'طباعة دفتر الصكوك', 'طباعة واستخراج البطاقات'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-surman',
    type: 'atm',
    name: 'ATM – فرع صرمان',
    bank: 'مصرف اليقين',
    address: 'صرمان',
    city: 'صرمان',
    lat: 32.7584125,
    lng: 12.5947031,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['إدارة الحساب', 'الإيداع النقدي', 'السحب النقدي', 'السحب بدون بطاقة'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-tajoura',
    type: 'atm',
    name: 'ATM – فرع تاجوراء',
    bank: 'مصرف اليقين',
    address: 'تاجوراء',
    city: 'طرابلس',
    lat: 32.8914852,
    lng: 13.3402398,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['إدارة الحساب', 'الإيداع النقدي', 'السحب النقدي', 'السحب بدون بطاقة'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-janzour',
    type: 'atm',
    name: 'ATM – فرع جنزور',
    bank: 'مصرف اليقين',
    address: 'جنزور',
    city: 'طرابلس',
    lat: 32.8727195,
    lng: 12.9861616,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['إدارة الحساب', 'السحب النقدي'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-hq-external',
    type: 'atm',
    name: 'ATM – الادارة العامة (خارجي)',
    bank: 'مصرف اليقين',
    address: 'طرابلس',
    city: 'طرابلس',
    lat: 32.9057265,
    lng: 13.2294069,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['إدارة الحساب', 'إيداع الصكوك', 'السحب النقدي'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-hq-internal',
    type: 'atm',
    name: 'ATM – الادارة العامة (داخلي)',
    bank: 'مصرف اليقين',
    address: 'طرابلس',
    city: 'طرابلس',
    lat: 32.90566477700083,
    lng: 13.229422205698722,
    status: 'unavailable',
    available24h: false,
    accessible: true,
    services: ['إدارة الحساب', 'السحب النقدي'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-zliten-branch',
    type: 'atm',
    name: 'ATM – فرع زليتن',
    bank: 'مصرف اليقين',
    address: 'زليتن',
    city: 'زليتن',
    lat: 32.4719596,
    lng: 14.5644523,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['إدارة الحساب', 'السحب النقدي'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-zliten-agency-1',
    type: 'atm',
    name: 'ATM – وكالة زليتن 1',
    bank: 'مصرف اليقين',
    address: 'زليتن',
    city: 'زليتن',
    lat: 32.4695976,
    lng: 14.5693255,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['السحب النقدي', 'طباعة دفتر الصكوك', 'فتح حساب مصرفي'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-zliten-agency-2',
    type: 'atm',
    name: 'ATM – وكالة زليتن 2',
    bank: 'مصرف اليقين',
    address: 'زليتن',
    city: 'زليتن',
    lat: 32.4695717541906,
    lng: 14.56932841914658,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['الإيداع النقدي', 'السحب النقدي', 'السحب بدون بطاقة'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'atm-yaqeen-sabha-branch',
    type: 'atm',
    name: 'ATM – فرع سبها',
    bank: 'مصرف اليقين',
    address: 'سبها',
    city: 'سبها',
    lat: 27.0455874,
    lng: 14.4188677,
    status: 'available',
    available24h: true,
    accessible: true,
    services: ['الإيداع النقدي', 'السحب النقدي', 'السحب بدون بطاقة'],
    image: ATM_IMAGE_URL
  },
  {
    id: 'pos-101',
    type: 'pos',
    name: 'نقطة بيع - مول ليبيا',
    bank: 'شبكة Ruya Pay',
    address: 'مول ليبيا - طريق عين زارة',
    city: 'طرابلس',
    lat: 32.8583,
    lng: 13.1885,
    status: 'available',
    available24h: true,
    accessible: true,
    merchant: 'متاجر الإلكترونيات المتحدة',
    image: 'https://images.unsplash.com/photo-1515165562835-c4c1bfae7a46?auto=format&fit=crop&w=1200&q=80',
    promo: {
      badge: 'عرض الأسبوع',
      title: 'خصم 15%',
      description: 'على الإلكترونيات الذكية والدفع عبر Ruya Pay',
      accent: '#ff9800'
    }
  },
  {
    id: 'pos-102',
    type: 'pos',
    name: 'نقطة بيع - سوق زمزم',
    bank: 'شبكة Ruya Pay',
    address: 'شارع جمال - بنغازي',
    city: 'بنغازي',
    lat: 32.1158,
    lng: 20.0681,
    status: 'available',
    available24h: false,
    accessible: true,
    merchant: 'أزياء زمزم',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    promo: {
      badge: 'تخفيض 10%',
      title: 'أزياء جديدة',
      description: 'خصومات على الملابس النسائية عند الدفع بالبطاقة',
      accent: '#00acc1'
    }
  },
  {
    id: 'pos-103',
    type: 'pos',
    name: 'نقطة بيع - كافية الواحة',
    bank: 'شبكة Ruya Pay',
    address: 'وسط سبها',
    city: 'سبها',
    lat: 27.0462,
    lng: 14.4299,
    status: 'available',
    available24h: false,
    accessible: true,
    merchant: 'كافية الواحة',
    image: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'pos-104',
    type: 'pos',
    name: 'نقطة بيع - مجمع الزاوية',
    bank: 'شبكة Ruya Pay',
    address: 'طريق الساحل - الزاوية',
    city: 'الزاوية',
    lat: 32.7571,
    lng: 12.7275,
    status: 'unavailable',
    available24h: false,
    accessible: false,
    merchant: 'مجمع الزاوية التجاري',
    image: 'https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?auto=format&fit=crop&w=1200&q=80',
    promo: {
      badge: 'قسيمة 20 د.ل',
      title: 'قسائم فورية',
      description: 'قسيمة مجانية عند الشراء بأكثر من 200 د.ل',
      accent: '#ab47bc'
    }
  }
];

const locations = ref<LocationPoint[]>(RAW_LOCATIONS.map(normalizeCoastalLocation));

export function useLocationsData(): { locations: Ref<LocationPoint[]> } {
  return { locations };
}

function normalizeCoastalLocation(point: LocationPoint): LocationPoint {
  if (!shouldNudgeInland(point)) {
    return point;
  }

  const lngJitter = jitterFromId(point.id);
  return {
    ...point,
    lat: Number((point.lat - COASTAL_LAT_DELTA).toFixed(6)),
    lng: Number((point.lng + COASTAL_LNG_BASE_DELTA + lngJitter).toFixed(6))
  };
}

function shouldNudgeInland(point: LocationPoint): boolean {
  const haystack = `${point.city ?? ''} ${point.address ?? ''}`.trim();
  if (!haystack.length) {
    return false;
  }

  const matchesCoast = COASTAL_CITY_HINTS.some(hint => haystack.includes(hint));
  const withinLngRange = point.lng >= COASTAL_LNG_RANGE[0] && point.lng <= COASTAL_LNG_RANGE[1];

  return matchesCoast && withinLngRange && point.lat >= COASTAL_LAT_THRESHOLD;
}

function jitterFromId(id: string): number {
  const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ((hash % 5) - 2) * 0.0015;
}
