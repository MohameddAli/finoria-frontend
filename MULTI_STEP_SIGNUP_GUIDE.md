# Multi-Step Bank Account Signup

## Overview
A 3-step bank account registration form following your project's design patterns with Nuxt 4 + Vuetify 3.

## File Structure

```
app/
├── pages/
│   └── multi-steps-signup/
│       └── index.vue                    # Main page with stepper
├── components/
│   ├── signup/
│   │   ├── StepBasicInfo.vue           # Step 1: National ID, Passport, Phone
│   │   ├── StepDocumentsEmployment.vue # Step 2: Documents + Employment info
│   │   └── StepBranchAddress.vue       # Step 3: Branch selection + Address
│   └── form/
│       ├── FileUploadField.vue         # Reusable file upload component
│       └── NationalitySelector.vue     # Libyan/Foreign selector with ID type
```

## Features

### Step 1: Basic Information
- National ID number
- Passport number
- Phone number

### Step 2: Documents & Employment
**Documents Upload:**
- Personal photo
- Passport photo
- Signature photo
- Employment letter

**Nationality:**
- Libyan/Foreign selector
- If Libyan: Choose National ID or Administrative ID
- Dynamic ID number field based on selection

**Employment Information:**
- Work sector (Public/Private/Self-employed)
- Education level
- Average income range
- Years of work
- Employer name
- Email
- Employer phone
- Job title
- Marital status

### Step 3: Branch & Address
- Branch selection (Tripoli, Benghazi, Misrata, Zawiya)
- Birth place
- Passport issue place
- Residential address

## Reusable Components

### FileUploadField
```vue
<FileUploadField
  v-model="file"
  label="Upload Document"
  accept="image/*"
  icon="mdi-file-upload"
/>
```

### NationalitySelector
```vue
<NationalitySelector
  v-model:nationality="nationality"
  v-model:id-type="idType"
  v-model:id-number="idNumber"
  :rules="[rules.required]"
/>
```

## Translations
All text is fully translated in Arabic and English:
- `i18n/locales/ar.json` - Arabic translations
- `i18n/locales/en.json` - English translations

## Usage
Navigate to `/multi-steps-signup` to access the registration form.

## Validation
- All required fields have validation rules
- Email format validation
- Phone number format validation
- Form validation on each step before proceeding

## Styling
- Follows Vuetify 3 design system
- Responsive layout (mobile-friendly)
- RTL support for Arabic
- Consistent with existing project components
