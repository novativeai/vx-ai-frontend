// This file defines the UI and parameters for each supported model.

interface ModelParameter {
  name: string;
  label: string;
  type: 'textarea' | 'image' | 'slider' | 'dropdown';
  defaultValue: string | number | null;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

interface TipContent {
  subtitle: string;
  text: string;
  list?: string[];
}

interface TipSection {
  title: string;
  content: TipContent[];
}

// Credit pricing rules based on parameters
interface CreditPricing {
  base: number; // Base credits for default settings
  modifiers?: {
    param: string; // Parameter name to check
    values: { [key: string]: number }; // Value -> credit multiplier or addition
    type: 'multiply' | 'add' | 'set'; // How to apply the modifier
  }[];
}

interface ModelConfig {
  id: string;
  displayName: string;
  outputType: 'video' | 'image';
  description: string;
  bannerImage: string;
  cardVideo?: string; // Video thumbnail for video models
  cardImage?: string; // Static image thumbnail for image models
  exampleVideo?: string; // Video shown as example on the generator page
  exampleImage?: string; // Static image shown as example for image models
  tags: string[];
  params: ModelParameter[];
  tips?: TipSection[];
  useCases?: TipSection[];
  creditCost: number; // Base credits required per generation (for display/fallback)
  creditPricing: CreditPricing; // Dynamic pricing rules
}

// Calculate credits based on selected parameters
export function calculateCredits(
  modelConfig: ModelConfig,
  params: { [key: string]: string | number | null }
): number {
  let credits = modelConfig.creditPricing.base;

  if (modelConfig.creditPricing.modifiers) {
    for (const modifier of modelConfig.creditPricing.modifiers) {
      const paramValue = params[modifier.param];
      if (paramValue !== null && paramValue !== undefined) {
        const stringValue = String(paramValue);
        const modifierValue = modifier.values[stringValue];

        if (modifierValue !== undefined) {
          switch (modifier.type) {
            case 'multiply':
              credits *= modifierValue;
              break;
            case 'add':
              credits += modifierValue;
              break;
            case 'set':
              credits = modifierValue;
              break;
          }
        }
      }
    }
  }

  // Round to nearest integer
  return Math.round(credits);
}

// Firebase Storage base URLs
const WEBSITE_VIDEOS = "https://storage.googleapis.com/reelzila.firebasestorage.app/website/videos";
const MARKETPLACE_VIDEOS = "https://storage.googleapis.com/reelzila.firebasestorage.app/marketplace/videos";
const MARKETPLACE_IMAGES = "https://storage.googleapis.com/reelzila.firebasestorage.app/marketplace/images";

export const modelConfigs: { [key: string]: ModelConfig } = {
  "veo-3.1": {
    id: "veo-3.1",
    displayName: "VEO 3.1",
    description: "Google's cutting-edge video generation model featuring native audio synthesis, physics simulation, and reference image composition. Create up to 8-second 1080p videos at 24fps with automatically synchronized dialogue, ambient soundscapes, and Foley effects.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${WEBSITE_VIDEOS}/robot-3.mp4`,
    exampleVideo: `${MARKETPLACE_VIDEOS}/055_Motorcycle_Highway_Speed.mp4`,
    tags: ["premium", "audio", "reference-images"],
    outputType: 'video',
    creditCost: 32,
    creditPricing: {
      base: 32,
      modifiers: [
        {
          param: "duration",
          values: { "4": 16, "6": 24, "8": 32 },
          type: "set"
        },
        {
          param: "generate_audio",
          values: { "false": 0.5 },
          type: "multiply"
        }
      ]
    },
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A cinematic shot of a woman walking through a neon-lit Tokyo street at night, rain glistening on the pavement, reflections everywhere. Shot on 35mm film, shallow depth of field.",
      },
      {
        name: "image",
        label: "Reference Image (optional)",
        type: "image",
        defaultValue: null,
      },
      {
        name: "negative_prompt",
        label: "Negative Prompt",
        type: "textarea",
        defaultValue: "",
      },
      {
        name: "duration",
        label: "Duration (seconds)",
        type: "dropdown",
        defaultValue: "8",
        options: ["4", "6", "8"],
      },
      {
        name: "aspect_ratio",
        label: "Aspect Ratio",
        type: "dropdown",
        defaultValue: "16:9",
        options: ["16:9", "9:16"],
      },
      {
        name: "resolution",
        label: "Resolution",
        type: "dropdown",
        defaultValue: "1080p",
        options: ["720p", "1080p"],
      },
      {
        name: "generate_audio",
        label: "Generate Audio",
        type: "dropdown",
        defaultValue: "true",
        options: ["true", "false"],
      },
    ],
    tips: [
      {
        title: "Prompting Guide",
        content: [
          {
            subtitle: "Specify Shot Composition",
            text: "Use cinematic terms to guide the camera. Include phrases like 'single shot', 'two shot', 'close-up', 'wide angle', or 'macro lens' to control framing and perspective.",
            list: [
              "Example: 'Close-up shot of hands crafting pottery, shallow depth of field'",
              "Example: 'Wide establishing shot of a mountain village at dawn'"
            ]
          },
          {
            subtitle: "Describe Camera Movement",
            text: "VEO 3.1 excels at camera motion. Specify movements like 'dolly shot', 'pan shot', 'tracking shot', 'crane shot', or 'handheld' for dynamic results."
          },
          {
            subtitle: "Set the Mood with Lighting",
            text: "Describe lighting conditions: 'golden hour', 'blue hour', 'harsh midday sun', 'soft diffused light', 'neon-lit', or 'candlelit' to establish atmosphere."
          }
        ]
      },
      {
        title: "Audio Generation & Physics",
        content: [
          {
            subtitle: "Native Audio Synthesis",
            text: "VEO 3.1 generates synchronized audio automatically - from dialogue and sound effects to ambient soundscapes and realistic Foley. Describe sounds in your prompt for better results.",
            list: [
              "Include audio cues: 'the sound of waves crashing', 'footsteps on gravel', 'distant thunder'",
              "For dialogue scenes, describe the conversation tone and setting",
              "Foley effects are automatically synchronized with visuals"
            ]
          },
          {
            subtitle: "Physics Simulation",
            text: "Realistic object behavior with accurate lighting and shadows. The model understands gravity, collisions, and material properties for believable motion."
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Use Cases",
        content: [
          {
            subtitle: "Marketing & Advertising",
            text: "Create high-quality promotional videos with synchronized audio. Generate short video ads with dialogue and sound effects for social media campaigns, product launches, and brand storytelling."
          },
          {
            subtitle: "Film & Entertainment",
            text: "Use for previsualization, storyboarding, and concept development. Generate cinematic sequences with natural audio for director-driven storytelling and B-roll footage."
          },
          {
            subtitle: "Content Creation",
            text: "Perfect for rapid prototyping and A/B testing of creative concepts. Generate multiple video variations with audio for campaigns and social media content."
          }
        ]
      }
    ]
  },
  "sora-2": {
    id: "sora-2",
    displayName: "Sora 2",
    description: "OpenAI's flagship video generation model with exceptional temporal consistency and photorealistic output. Creates up to 12-second videos with smooth motion, accurate physics, and stunning visual quality across diverse styles and subjects.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${WEBSITE_VIDEOS}/f1-speeding.mp4`,
    exampleVideo: `${MARKETPLACE_VIDEOS}/054_Emerald_Eyes_Kitchen_Dance.mp4`,
    tags: ["top-rated", "photorealistic", "cinematic"],
    outputType: 'video',
    creditCost: 4,
    creditPricing: {
      base: 4,
      modifiers: [
        {
          param: "duration",
          values: { "4": 4, "8": 8, "12": 12 },
          type: "set"
        }
      ]
    },
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A cinematic shot of a woman walking through a neon-lit city at night, reflections on wet pavement, shallow depth of field, 35mm film aesthetic.",
      },
      {
        name: "image",
        label: "Starting Image (optional)",
        type: "image",
        defaultValue: null,
      },
      {
        name: "duration",
        label: "Duration (seconds)",
        type: "dropdown",
        defaultValue: "4",
        options: ["4", "8", "12"],
      },
      {
        name: "aspect_ratio",
        label: "Aspect Ratio",
        type: "dropdown",
        defaultValue: "16:9",
        options: ["16:9", "9:16", "1:1"],
      },
      {
        name: "resolution",
        label: "Resolution",
        type: "dropdown",
        defaultValue: "1080p",
        options: ["720p", "1080p"],
      },
    ],
    tips: [
      {
        title: "Prompting Guide",
        content: [
          {
            subtitle: "Cinematic Language",
            text: "Sora 2 excels with cinematic terminology. Use terms like 'dolly shot', 'tracking shot', 'crane movement', 'shallow depth of field', and specific lens references (35mm, 85mm) for professional results.",
            list: [
              "Example: 'Tracking shot following a runner through city streets, shallow DOF, golden hour'",
              "Example: 'Slow dolly push-in on subject's face, dramatic lighting, film grain'"
            ]
          },
          {
            subtitle: "Motion Descriptions",
            text: "Be specific about movement. Describe both subject motion and camera motion separately for best results. Sora 2 handles complex multi-subject scenes with ease."
          },
          {
            subtitle: "Lighting and Atmosphere",
            text: "Specify lighting conditions clearly: 'golden hour', 'blue hour', 'neon-lit', 'candlelit', 'overcast diffused light'. The model responds exceptionally well to atmospheric descriptions."
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Primary Use Cases",
        content: [
          {
            subtitle: "Commercial Production",
            text: "Create broadcast-quality video content for advertising, social media campaigns, and brand storytelling. The exceptional motion quality rivals professional footage."
          },
          {
            subtitle: "Creative Content",
            text: "Perfect for music videos, short films, and artistic projects. The cinematic control and consistent quality enable professional-grade creative expression."
          },
          {
            subtitle: "Portrait Animation",
            text: "Transform static portraits into dynamic videos with natural expressions and movements. Ideal for social media content creators and digital marketing."
          }
        ]
      }
    ]
  },
  "kling-2.6": {
    id: "kling-2.6",
    displayName: "Kling 2.6 Pro",
    description: "Kuaishou's flagship video generation model featuring industry-leading motion quality and temporal consistency. Generates 5 or 10-second videos at 1080p with exceptional subject coherence, natural physics simulation, and cinematic camera movements.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${WEBSITE_VIDEOS}/tron-1.mp4`,
    exampleVideo: `${MARKETPLACE_VIDEOS}/052_Asian_Girl_Subway_Orange_Headphones.mp4`,
    tags: ["top-rated", "motion", "cinematic"],
    outputType: 'video',
    creditCost: 5,
    creditPricing: {
      base: 5,
      modifiers: [
        {
          param: "duration",
          values: { "5": 5, "10": 10 },
          type: "set"
        }
      ]
    },
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A cinematic shot of a woman walking through a neon-lit city at night, reflections on wet pavement, shallow depth of field, 35mm film aesthetic.",
      },
      {
        name: "image",
        label: "Starting Image (optional)",
        type: "image",
        defaultValue: null,
      },
      {
        name: "duration",
        label: "Duration (seconds)",
        type: "dropdown",
        defaultValue: "5",
        options: ["5", "10"],
      },
      {
        name: "cfg_scale",
        label: "CFG Scale",
        type: "slider",
        defaultValue: 7,
        min: 1,
        max: 15,
        step: 0.5,
      },
      {
        name: "aspect_ratio",
        label: "Aspect Ratio",
        type: "dropdown",
        defaultValue: "16:9",
        options: ["16:9", "9:16", "1:1"],
      },
      {
        name: "motion_strength",
        label: "Motion Strength",
        type: "slider",
        defaultValue: 5,
        min: 1,
        max: 10,
        step: 1,
      },
    ],
    tips: [
      {
        title: "Prompting Guide",
        content: [
          {
            subtitle: "Cinematic Language",
            text: "Kling 2.6 excels with cinematic terminology. Use terms like 'dolly shot', 'tracking shot', 'crane movement', 'shallow depth of field', and specific lens references (35mm, 85mm) for professional results.",
            list: [
              "Example: 'Tracking shot following a runner through city streets, shallow DOF, golden hour'",
              "Example: 'Slow dolly push-in on subject's face, dramatic lighting, film grain'"
            ]
          },
          {
            subtitle: "Motion Descriptions",
            text: "Be specific about movement. Describe both subject motion and camera motion separately for best results. Kling 2.6 handles complex multi-subject scenes with ease."
          },
          {
            subtitle: "Lighting and Atmosphere",
            text: "Specify lighting conditions clearly: 'golden hour', 'blue hour', 'neon-lit', 'candlelit', 'overcast diffused light'. The model responds exceptionally well to atmospheric descriptions."
          }
        ]
      },
      {
        title: "Technical Settings",
        content: [
          {
            subtitle: "CFG Scale",
            text: "Controls how closely the output follows your prompt. Higher values (10-15) give more literal interpretations, while lower values (3-6) allow more creative freedom."
          },
          {
            subtitle: "Motion Strength",
            text: "Adjusts the amount of movement in the video. Lower values (1-3) create subtle, gentle motion. Higher values (7-10) generate more dynamic, energetic movements."
          },
          {
            subtitle: "Image-to-Video Mode",
            text: "Upload a starting image to animate it. The model preserves facial features and clothing details while adding natural, fluid motion. Perfect for bringing portraits to life."
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Primary Use Cases",
        content: [
          {
            subtitle: "Commercial Production",
            text: "Create broadcast-quality video content for advertising, social media campaigns, and brand storytelling. The exceptional motion quality rivals professional footage."
          },
          {
            subtitle: "Creative Content",
            text: "Perfect for music videos, short films, and artistic projects. The cinematic control and consistent quality enable professional-grade creative expression."
          },
          {
            subtitle: "Portrait Animation",
            text: "Transform static portraits into dynamic videos with natural expressions and movements. Ideal for social media content creators and digital marketing."
          }
        ]
      }
    ]
  },
  "ltx-2": {
    id: "ltx-2",
    displayName: "LTX Video 2",
    description: "Lightricks' fast and efficient video generation model offering excellent quality at a low cost. Perfect for rapid prototyping and high-volume generation with customizable inference steps and guidance settings.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${MARKETPLACE_VIDEOS}/048_Dark_Room_Redhead_Ring_Light.mp4`,
    exampleVideo: `${MARKETPLACE_VIDEOS}/050_Cyberpunk_Girl_Raining_Night.mp4`,
    tags: ["budget", "fast", "efficient"],
    outputType: 'video',
    creditCost: 1,
    creditPricing: {
      base: 1
    },
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A cinematic shot of a woman walking through a city at sunset, golden light illuminating her silhouette, shallow depth of field.",
      },
      {
        name: "image",
        label: "Starting Image (optional)",
        type: "image",
        defaultValue: null,
      },
      {
        name: "negative_prompt",
        label: "Negative Prompt",
        type: "textarea",
        defaultValue: "blurry, distorted, low quality, pixelated",
      },
      {
        name: "num_inference_steps",
        label: "Inference Steps",
        type: "slider",
        defaultValue: 30,
        min: 10,
        max: 50,
        step: 5,
      },
      {
        name: "guidance_scale",
        label: "Guidance Scale",
        type: "slider",
        defaultValue: 7,
        min: 1,
        max: 20,
        step: 0.5,
      },
    ],
    tips: [
      {
        title: "Prompting Guide",
        content: [
          {
            subtitle: "Clear Descriptions",
            text: "LTX Video 2 works best with clear, concise prompts. Focus on the main subject and action rather than overly complex descriptions."
          },
          {
            subtitle: "Negative Prompts",
            text: "Use negative prompts to avoid unwanted artifacts. Common exclusions: 'blurry', 'distorted', 'low quality', 'watermark', 'text'."
          }
        ]
      },
      {
        title: "Technical Settings",
        content: [
          {
            subtitle: "Inference Steps",
            text: "Controls generation quality vs speed. Lower values (10-20) are faster but may have artifacts. Higher values (30-50) produce cleaner results but take longer."
          },
          {
            subtitle: "Guidance Scale",
            text: "Determines how closely the model follows your prompt. Values 5-8 offer good balance. Higher values (12-20) follow prompts more literally but may reduce creativity."
          },
          {
            subtitle: "Image-to-Video",
            text: "Upload a starting image to animate it. The model will use your image as the first frame and generate motion based on your prompt."
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Primary Use Cases",
        content: [
          {
            subtitle: "Rapid Prototyping",
            text: "Quickly test ideas and concepts before committing to higher-cost models. Perfect for iterating on prompts and compositions."
          },
          {
            subtitle: "High-Volume Generation",
            text: "Generate large quantities of videos at minimal cost. Ideal for social media content calendars and A/B testing."
          },
          {
            subtitle: "Learning & Experimentation",
            text: "Great for learning video AI prompting techniques without significant credit investment."
          }
        ]
      }
    ]
  },
  "hailuo-2.3-pro": {
    id: "hailuo-2.3-pro",
    displayName: "Hailuo 2.3 Pro",
    description: "MiniMax's professional video generation model featuring exceptional character consistency and natural motion. Generates high-quality 5 or 10-second videos with intelligent prompt optimization for enhanced results.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${MARKETPLACE_VIDEOS}/046_Vintage_Floral_Dress_Garden.mp4`,
    exampleVideo: `${MARKETPLACE_VIDEOS}/049_Pink_Sunset_Girl_Roof.mp4`,
    tags: ["professional", "character", "consistent"],
    outputType: 'video',
    creditCost: 4,
    creditPricing: {
      base: 4,
      modifiers: [
        {
          param: "duration",
          values: { "5": 4, "10": 8 },
          type: "set"
        }
      ]
    },
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A young woman dancing gracefully in a modern kitchen, natural lighting through windows, joyful expression, smooth flowing movements.",
      },
      {
        name: "image",
        label: "Starting Image (optional)",
        type: "image",
        defaultValue: null,
      },
      {
        name: "duration",
        label: "Duration (seconds)",
        type: "dropdown",
        defaultValue: "5",
        options: ["5", "10"],
      },
      {
        name: "resolution",
        label: "Resolution",
        type: "dropdown",
        defaultValue: "1080p",
        options: ["720p", "1080p"],
      },
      {
        name: "prompt_optimizer",
        label: "Prompt Optimizer",
        type: "dropdown",
        defaultValue: "true",
        options: ["true", "false"],
      },
    ],
    tips: [
      {
        title: "Prompting Guide",
        content: [
          {
            subtitle: "Character Focus",
            text: "Hailuo 2.3 Pro excels at human subjects. Describe characters in detail including clothing, expressions, and posture for best results."
          },
          {
            subtitle: "Natural Motion",
            text: "The model produces exceptionally natural human motion. Describe actions clearly: 'walking confidently', 'dancing gracefully', 'turning to look over shoulder'."
          },
          {
            subtitle: "Prompt Optimizer",
            text: "Enable the prompt optimizer to automatically enhance your prompt for better results. The AI will expand and improve your description while maintaining your intent."
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Primary Use Cases",
        content: [
          {
            subtitle: "Character Animation",
            text: "Create videos featuring human subjects with consistent appearance and natural motion. Perfect for ads, social content, and storytelling."
          },
          {
            subtitle: "Portrait-to-Video",
            text: "Transform photos into dynamic videos. Upload a portrait and describe the motion you want to see."
          },
          {
            subtitle: "Professional Content",
            text: "Generate polished, professional-quality videos suitable for commercial use and marketing campaigns."
          }
        ]
      }
    ]
  },
  "nano-banana-pro": {
    id: "nano-banana-pro",
    displayName: "Nano Banana Pro",
    description: "High-quality image generation model optimized for speed and resolution. Create stunning images up to 4K resolution with excellent prompt adherence and diverse artistic styles. Perfect for concept art, illustrations, and professional imagery.",
    bannerImage: "/banners/wan-banner.jpg",
    cardImage: "/images/nano-banana-card.png",
    exampleImage: "/images/nano-banana-example.png",
    tags: ["image", "4K", "fast"],
    outputType: 'image',
    creditCost: 2,
    creditPricing: {
      base: 2,
      modifiers: [
        {
          param: "resolution",
          values: { "1K": 2, "2K": 3, "4K": 4 },
          type: "set"
        }
      ]
    },
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A stunning portrait of a woman with emerald eyes, soft golden hour lighting, ultra detailed skin texture, 85mm lens, shallow depth of field, professional photography.",
      },
      {
        name: "num_images",
        label: "Number of Images",
        type: "slider",
        defaultValue: 1,
        min: 1,
        max: 4,
        step: 1,
      },
      {
        name: "resolution",
        label: "Resolution",
        type: "dropdown",
        defaultValue: "2K",
        options: ["1K", "2K", "4K"],
      },
      {
        name: "aspect_ratio",
        label: "Aspect Ratio",
        type: "dropdown",
        defaultValue: "16:9",
        options: ["21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21"],
      },
      {
        name: "output_format",
        label: "Output Format",
        type: "dropdown",
        defaultValue: "png",
        options: ["png", "jpg", "webp"],
      },
    ],
    tips: [
      {
        title: "Prompting Guide",
        content: [
          {
            subtitle: "Detailed Descriptions",
            text: "Nano Banana Pro excels with detailed, descriptive prompts. Include specific details about lighting, composition, style, and atmosphere for best results.",
            list: [
              "Specify camera settings: '85mm lens', 'f/1.4 aperture', 'shallow DOF'",
              "Include lighting details: 'golden hour', 'soft diffused light', 'dramatic shadows'",
              "Add style references: 'cinematic', 'editorial photography', 'fine art'"
            ]
          },
          {
            subtitle: "Resolution Selection",
            text: "Choose resolution based on your needs: 1K for web use and previews, 2K for standard professional work, 4K for print materials and large displays."
          },
          {
            subtitle: "Aspect Ratio Selection",
            text: "Choose aspect ratios that match your intended use: 16:9 for desktop wallpapers, 9:16 for mobile, 1:1 for social media, 21:9 for cinematic widescreen."
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Primary Use Cases",
        content: [
          {
            subtitle: "Professional Photography",
            text: "Generate photorealistic portraits, product shots, and editorial imagery at high resolution. 4K output enables large-format prints and professional use."
          },
          {
            subtitle: "Marketing & Advertising",
            text: "Create high-resolution marketing assets, social media content, and advertising visuals with exceptional quality and fast turnaround."
          },
          {
            subtitle: "Concept Art & Illustration",
            text: "Rapidly generate concept art, illustrations, and visual ideas for creative projects. Multiple image generation enables exploration of variations."
          }
        ]
      }
    ]
  },
};
