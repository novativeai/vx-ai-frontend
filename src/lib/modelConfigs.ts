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

interface ModelConfig {
  id: string;
  displayName: string;
  outputType: 'video' | 'image';
  description: string;
  bannerImage: string;
  cardVideo: string;
  tags: string[];
  params: ModelParameter[];
  tips?: TipSection[];
  useCases?: TipSection[];
}

// Firebase Storage base URL for marketplace videos
const STORAGE_BASE = "https://storage.googleapis.com/reelzila.firebasestorage.app/marketplace/videos";

export const modelConfigs: { [key: string]: ModelConfig } = {
  "kling-2.5": {
    id: "kling-2.5",
    displayName: "Kling 2.5 Turbo Pro",
    description: "Kuaishou's flagship video generation model released November 2025, featuring industry-leading motion quality and temporal consistency. Generates 5 or 10-second videos at 1080p with exceptional subject coherence, natural physics simulation, and cinematic camera movements. Consistently ranked #1 in video generation benchmarks.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${STORAGE_BASE}/054_Emerald_Eyes_Kitchen_Dance.mp4`,
    tags: ["top-rated", "motion", "cinematic"],
    outputType: 'video',
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A cinematic shot of a woman walking through a neon-lit city at night, reflections on wet pavement, shallow depth of field, 35mm film aesthetic.",
      },
      {
        name: "start_image",
        label: "Starting Image (optional)",
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
        defaultValue: "5",
        options: ["5", "10"],
      },
      {
        name: "aspect_ratio",
        label: "Aspect Ratio",
        type: "dropdown",
        defaultValue: "16:9",
        options: ["16:9", "9:16", "1:1"],
      },
    ],
    tips: [
      {
        title: "Prompting Guide",
        content: [
          {
            subtitle: "Cinematic Language",
            text: "Kling 2.5 excels with cinematic terminology. Use terms like 'dolly shot', 'tracking shot', 'crane movement', 'shallow depth of field', and specific lens references (35mm, 85mm) for professional results.",
            list: [
              "Example: 'Tracking shot following a runner through city streets, shallow DOF, golden hour'",
              "Example: 'Slow dolly push-in on subject's face, dramatic lighting, film grain'"
            ]
          },
          {
            subtitle: "Motion Descriptions",
            text: "Be specific about movement. Describe both subject motion and camera motion separately for best results. Kling 2.5 handles complex multi-subject scenes with ease."
          },
          {
            subtitle: "Lighting and Atmosphere",
            text: "Specify lighting conditions clearly: 'golden hour', 'blue hour', 'neon-lit', 'candlelit', 'overcast diffused light'. The model responds exceptionally well to atmospheric descriptions."
          }
        ]
      },
      {
        title: "Technical Excellence",
        content: [
          {
            subtitle: "Superior Motion Quality",
            text: "Kling 2.5 is recognized for industry-leading motion coherence. Complex movements like dancing, sports, and multi-character interactions are handled with exceptional stability.",
            list: [
              "Natural physics simulation for realistic object interactions",
              "Consistent subject identity throughout the video",
              "Smooth transitions and camera movements"
            ]
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
      },
      {
        title: "Benchmark Performance",
        content: [
          {
            subtitle: "Industry Leader",
            text: "Consistently ranks first in VBench and other video generation benchmarks. Outperforms competitors in motion quality, temporal consistency, and overall video coherence."
          }
        ]
      }
    ]
  },
  "veo-3.1": {
    id: "veo-3.1",
    displayName: "VEO 3.1",
    description: "Google's cutting-edge video generation model released October 2025, featuring native audio synthesis, physics simulation, and reference image composition. Create up to 8-second 1080p videos at 24fps with automatically synchronized dialogue, ambient soundscapes, and Foley effects.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${STORAGE_BASE}/052_Asian_Girl_Subway_Orange_Headphones.mp4`,
    tags: ["new", "audio", "reference-images"],
    outputType: 'video',
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A cinematic shot of a woman walking through a neon-lit Tokyo street at night, rain glistening on the pavement, reflections everywhere. Shot on 35mm film, shallow depth of field.",
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
            text: "Veo 3.1 excels at camera motion. Specify movements like 'dolly shot', 'pan shot', 'tracking shot', 'crane shot', or 'handheld' for dynamic results."
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
            text: "Veo 3.1 generates synchronized audio automatically - from dialogue and sound effects to ambient soundscapes and realistic Foley. Describe sounds in your prompt for better results.",
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
      },
      {
        title: "Advanced Features",
        content: [
          {
            subtitle: "Reference Image Composition",
            text: "Combine up to 3 reference images to control characters, objects, and style within a single scene. Perfect for maintaining consistency across video sequences."
          },
          {
            subtitle: "Frame-to-Video Interpolation",
            text: "Specify both starting and ending frames to create seamless transitions. The model generates intermediate frames based on your prompt for precise cinematic control."
          },
          {
            subtitle: "SynthID Watermarking",
            text: "Videos are automatically watermarked with Google's SynthID technology for authenticity verification."
          }
        ]
      }
    ]
  },
  "seedance-1-pro": {
    id: "seedance-1-pro",
    displayName: "Seedance-1 Pro",
    description: "ByteDance's award-winning model released June 2025, specializing in multi-shot storytelling with seamless subject consistency. Generates 1080p videos at 24fps with sophisticated motion dynamics and cinema-grade aesthetic control. Tops leaderboards for T2V and I2V performance.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${STORAGE_BASE}/054_Emerald_Eyes_Kitchen_Dance.mp4`,
    tags: ["motion", "cinematic", "multi-shot"],
    outputType: 'video',
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A dancer performs fluid contemporary movements in an abandoned warehouse, dust particles floating in shafts of light. Cinematic, 35mm film grain.",
      },
      {
        name: "resolution",
        label: "Resolution",
        type: "dropdown",
        defaultValue: "720p",
        options: ["480p", "720p", "1080p"],
      },
      {
        name: "duration",
        label: "Duration (seconds)",
        type: "slider",
        defaultValue: 5,
        min: 1,
        max: 5,
        step: 1,
      },
    ],
    tips: [
      {
        title: "Technical Innovations",
        content: [
          {
            subtitle: "Multi-Shot Storytelling",
            text: "Seedance 1.0 Pro excels at seamless 2-3 shot transitions while maintaining perfect subject consistency. Create coherent narrative sequences without breaking character continuity."
          },
          {
            subtitle: "Advanced Motion Architecture",
            text: "Combines Temporally-Causal VAE for frame coherence with Decoupled Spatio-Temporal Diffusion Transformer. Handles nuanced body motion, athletic actions, and detailed facial expressions with exceptional stability."
          },
          {
            subtitle: "Wide Dynamic Range",
            text: "Supports large-scale movements with comprehensive semantic control. Exceptional at generating complex scenes with multiple subjects and accurate spatial relationships."
          }
        ]
      },
      {
        title: "Prompting Strategy",
        content: [
          {
            subtitle: "Basic Formula",
            text: "For new users: Simple, clear prompts work well. Focus on what you want to see happen.",
            list: [
              "Formula: Subject + Scene + Motion",
              "Subject: The main character or focus (person, animal, object)",
              "Scene: The environment and setting",
              "Motion: Specific actions and movements"
            ]
          },
          {
            subtitle: "Pro Formula",
            text: "For experienced users: Enhance with cinematography details for award-quality results.",
            list: [
              "Formula: Subject (details) + Scene (lighting/mood) + Motion (style) + Cinematic language",
              "Example: 'A dancer in flowing white dress, warm golden hour light, performing graceful contemporary movements across a desert landscape, cinematic, 35mm'"
            ]
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Primary Use Cases",
        content: [
          {
            subtitle: "Multi-Shot Narrative Production",
            text: "Create coherent short films and stories with 2-3 shot transitions while maintaining character consistency. Perfect for narrative-driven content and commercials."
          },
          {
            subtitle: "Performance & Dance Content",
            text: "Exceptional at capturing nuanced body movements, athletic actions, and facial expressions. Ideal for dance videos, sports highlights, and performance documentation."
          },
          {
            subtitle: "Commercial & Advertising",
            text: "Cinema-grade aesthetic control produces professional-quality ads. 41-second generation time for 5-second 1080p videos enables rapid iteration and testing."
          }
        ]
      },
      {
        title: "Performance Metrics",
        content: [
          {
            subtitle: "Leaderboard Rankings",
            text: "Consistently ranks first in Text-to-Video and Image-to-Video benchmarks, outperforming VEO 3.1 and Kling 2.0 across multiple evaluation metrics."
          }
        ]
      }
    ]
  },
  "wan-2.2": {
    id: "wan-2.2",
    displayName: "WAN 2.2 14B",
    description: "ByteDance's efficient Mixture-of-Experts model released July 2025 with 27B parameters (14B active). Enhanced training on 65.6% more images and 83.2% more videos. Supports 480p/720p at 24fps with reduced flickering and excellent T2V, I2V, and hybrid modes.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${STORAGE_BASE}/055_Motorcycle_Highway_Speed.mp4`,
    tags: ["image-to-video", "photorealistic"],
    outputType: 'video',
    params: [
      {
        name: "image",
        label: "Input Image",
        type: "image",
        defaultValue: null,
      },
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "Commercial video of a luxury watch rotating slowly, dramatic lighting highlighting the craftsmanship and details.",
      },
      {
        name: "resolution",
        label: "Resolution",
        type: "dropdown",
        defaultValue: "480p",
        options: ["480p", "720p"]
      },
      {
        name: "num_frames",
        label: "Number of frames",
        type: "slider",
        defaultValue: 81,
        min: 81,
        max: 100,
        step: 1
      },
      {
        name: "frames_per_second",
        label: "Frames per second",
        type: "slider",
        defaultValue: 16,
        min: 5,
        max: 24,
        step: 1
      },
    ],
    tips: [
      {
        title: "Model Architecture",
        content: [
          {
            subtitle: "Mixture-of-Experts Design",
            text: "WAN 2.2's MoE architecture uses two specialized experts: a high-noise expert for spatial layout and composition, and a low-noise expert for fine details and quality. This enables efficient 14B active parameters from a 27B total model."
          },
          {
            subtitle: "Enhanced Training Data",
            text: "Trained on 65.6% more images and 83.2% more videos compared to WAN 2.1. Supports three modes: Text-to-Video (T2V), Image-to-Video (I2V), and hybrid Text+Image-to-Video (TI2V)."
          },
          {
            subtitle: "Reduced Frame Flickering",
            text: "Significant improvements in temporal consistency eliminate the flickering artifacts from previous versions, resulting in smoother, more natural video output."
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Primary Use Cases",
        content: [
          {
            subtitle: "Product Visualization & E-Commerce",
            text: "Transform static product photos into engaging video content with smooth camera movements. Perfect for product showcases, 360-degree rotations, and e-commerce platforms."
          },
          {
            subtitle: "Photorealistic Animation",
            text: "Bring still photographs to life with natural, fluid motion. Excels at maintaining visual quality and preserving fine details from the source image."
          },
          {
            subtitle: "Content Variety",
            text: "Supports T2V for generating videos from prompts alone, I2V for animating images, and hybrid TI2V combining both for maximum flexibility."
          }
        ]
      },
      {
        title: "Technical Advantages",
        content: [
          {
            subtitle: "Generation Speed",
            text: "39 seconds to generate 480p videos, 150 seconds for 720p on Replicate. Fast iteration suitable for rapid prototyping and A/B testing."
          }
        ]
      }
    ]
  },
  "flux-1.1-pro-ultra": {
    id: "flux-1.1-pro-ultra",
    displayName: "FLUX 1.1 Pro Ultra",
    description: "Black Forest Labs&apos; flagship text-to-image model generating ultra high-resolution images up to 4 megapixels. Features exceptional prompt adherence, output diversity, and blazing fast generation. Supports raw mode for natural, less processed aesthetics.",
    bannerImage: "/banners/wan-banner.jpg",
    cardVideo: `${STORAGE_BASE}/053_Macro_Shot_Emerald_Eyes_Redhead.mp4`,
    tags: ["image", "4MP", "ultra-fast"],
    outputType: 'image',
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "A stunning portrait of a woman with emerald eyes, soft golden hour lighting, ultra detailed skin texture, 85mm lens, shallow depth of field, professional photography.",
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
        defaultValue: "jpg",
        options: ["jpg", "png"],
      },
      {
        name: "raw",
        label: "Raw Mode",
        type: "dropdown",
        defaultValue: "false",
        options: ["true", "false"],
      },
    ],
    tips: [
      {
        title: "Prompting Guide",
        content: [
          {
            subtitle: "Detailed Descriptions",
            text: "FLUX 1.1 Pro Ultra excels with detailed, descriptive prompts. Include specific details about lighting, composition, style, and atmosphere for best results.",
            list: [
              "Specify camera settings: &apos;85mm lens&apos;, &apos;f/1.4 aperture&apos;, &apos;shallow DOF&apos;",
              "Include lighting details: &apos;golden hour&apos;, &apos;soft diffused light&apos;, &apos;dramatic shadows&apos;",
              "Add style references: &apos;cinematic&apos;, &apos;editorial photography&apos;, &apos;fine art&apos;"
            ]
          },
          {
            subtitle: "Raw Mode",
            text: "Enable raw mode for more natural, less processed images. Perfect for realistic scenes and photography where you want organic, authentic results."
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
            text: "Generate photorealistic portraits, product shots, and editorial imagery at unprecedented resolution. 4MP output enables large-format prints and professional use."
          },
          {
            subtitle: "Marketing & Advertising",
            text: "Create high-resolution marketing assets, social media content, and advertising visuals with exceptional quality and fast turnaround."
          },
          {
            subtitle: "Creative Exploration",
            text: "Rapid ideation and concept development for artists, designers, and creative professionals. Fast generation enables extensive exploration."
          }
        ]
      },
      {
        title: "Technical Advantages",
        content: [
          {
            subtitle: "4 Megapixel Output",
            text: "Generate images up to 4MP resolution, perfect for print materials, large displays, and professional applications requiring high-resolution assets."
          },
          {
            subtitle: "Generation Speed",
            text: "Industry-leading generation speed enables rapid iteration and exploration without long wait times."
          }
        ]
      }
    ]
  },
};
