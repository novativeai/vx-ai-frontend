// This file defines the UI and parameters for each supported model.

interface ModelParameter {
  name: string;
  label: string;
  type: 'textarea' | 'image' | 'slider' | 'dropdown';
  // --- THE FIX: Replace 'any' with the specific types you are using ---
  defaultValue: string | number | null;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

// Add this interface to define the structure of our new tips content
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
  // THE FIX: Use a dedicated property for the card's hover video
  cardVideo: string; 
  tags: string[];
  params: ModelParameter[];
  tips?: TipSection[];
  useCases?: TipSection[];
}

export const modelConfigs: { [key: string]: ModelConfig } = {
  "veo-3-fast": {
    id: "veo-3-fast",
    displayName: "VEO 3 Fast",
    description: "A production-oriented variant of Google’s Veo family: optimized for fast, cost-efficient text→video and image→video generation with native audio support and strong prompt-following. Best for quick ad prototypes, short product demos, mobile/social vertical videos, and workflows that need many iterations with good visual fidelity.",
    bannerImage: "/banners/wan-banner.jpg", // A wide, cinematic image
    cardVideo: "/videos/f1-speeding.mp4", // This is the video that will play on hover    // A more focused, square-like image
    tags: ["new", "lora", "personalization"],
    outputType: 'video',
    params: [
      {
        name: "image",
        label: "Image",
        type: "image",
        defaultValue: null,
      },
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "The white dragon warrior stands still, eyes full of determination and strength. The camera slowly moves closer or circles around the warrior, highlighting the powerful presence and heroic spirit of the character.",
      },
      {
        name: "negative_prompt",
        label: "Negative prompt",
        type: "textarea",
        defaultValue: "",
      },
    ],
    tips: [
      {
        title: "Guideline",
        content: [
          {
            subtitle: "Be Descriptive and Specific",
            text: "Instead of 'a car', try 'a vintage red sports car driving through a neon-lit city at night'. The more detail you provide, the better the AI can interpret your vision."
          },
          {
            subtitle: "Describe the Camera Work",
            text: "Incorporate cinematic terms to guide the camera. Use phrases like 'cinematic shot', 'dolly zoom', 'aerial drone shot', or 'close-up shot' to control the perspective and movement.",
            list: [
              "Example: 'An aerial drone shot flying over a dense, foggy forest.'",
              "Example: 'Close-up on a chef's hands artfully plating a gourmet dish.'"
            ]
          },
          {
            subtitle: "Specify the Mood and Lighting",
            text: "Words like 'dramatic lighting', 'golden hour', 'moody atmosphere', or 'vibrant and colorful' can drastically change the feel of your generated video."
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
            text: "Create high-quality promotional videos and product visualizations quickly. Generate short video ads with synchronized dialogue and sound effects for social media campaigns, product launches, and brand storytelling."
          },
          {
            subtitle: "Film & Entertainment Production",
            text: "Use VEO 3 for previsualization, storyboarding, and concept development. Generate cinematic sequences for director-driven storytelling, create B-roll footage, and develop visual concepts before full production."
          },
          {
            subtitle: "Content Creation at Scale",
            text: "Perfect for rapid prototyping and A/B testing of creative concepts. Generate multiple video variations quickly for campaigns, social media content, and digital marketing materials with consistent quality."
          }
        ]
      },
      {
        title: "Educational & Creative Uses",
        content: [
          {
            subtitle: "Educational Content",
            text: "Create engaging educational videos with clear narration and visual demonstrations. Generate virtual tours of museums, historical sites, and cultural institutions with immersive voiceovers and atmospheric audio."
          },
          {
            subtitle: "Short Film & Storytelling",
            text: "Transform scripts into cinematic short films with character dialogue, environmental sounds, and narrative sequences. Ideal for indie filmmakers and storytellers exploring AI-powered production workflows."
          },
          {
            subtitle: "Social Media & Personal Projects",
            text: "Bring static photos to life with motion, create dynamic presentations, and generate animated content for personal creative projects and social media engagement."
          }
        ]
      }
    ]
  },
  "seedance-1-pro": {
    id: "seedance-1-pro",
    displayName: "Seedance-1 Pro",
    description: "ByteDance’s Seedance pro model focused on fluid image→video and multi-shot generation. Excels at generating natural, continuous motion from stills, cinematic camera moves, and multi-shot sequences while remaining tuned for faster inference and lower compute than heavier cinematic models.",
    bannerImage: "/banners/wan-banner.jpg", // A wide, cinematic image
    cardVideo: "/videos/robot-3.mp4", // This is the video that will play on hover
    tags: ["new", "lora", "personalization"],
    outputType: 'video',
    params: [
      /*{
        name: "image",
        label: "Input Image",
        type: "image",
        defaultValue: null,
      },*/
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "The white dragon warrior stands still, eyes full of determination and strength. The camera slowly moves closer or circles around the warrior, highlighting the powerful presence and heroic spirit of the character.",
      },
      {
        name: "resolution",
        label: "Resolution",
        type: "dropdown",
        defaultValue: "480p",
        options: ["480p", "720p", "1080p"],
      },
      {
        name: "duration",
        label: "Duration",
        type: "slider",
        defaultValue: 5,
        min: 1,
        max: 5,
        step: 1,
      },
    ],
    tips: [
      {
        title: "Guideline",
        content: [
          {
            subtitle: "Cinema-Grade Aesthetic Control",
            text: "Integration of professional cinematography principles—including lighting, color, and cinematic language—allows for precise aesthetic control through multi-faceted keywords, resulting in visuals that are both stylistically diverse and rich in nuanced detail."
          },
          {
            subtitle: "Greatly Improved Complex Motion Generation",
            text: "Dynamic generation capabilities now enable precise control and stable generation of highly complex movements. This includes nuanced body motion, athletic actions, and detailed facial expressions. The resulting motion is exceptionally fluid, with details rendered in a natural and realistic manner."
          },
          {
            subtitle: "Enhanced Real-World Replication",
            text: "Featuring significantly more powerful semantic control and instruction-following capabilities. This update brings remarkable improvements in multi-subject generation, the depiction of interactions, and spatial accuracy within complex scenes. As a result, users can now reliably replicate real-world scenarios through text prompts."
          }
        ]
      },
      {
        title: "Prompt Recipe Guide",
        content: [
          {
            subtitle: "Basic Formula",
            text: "For new users trying AI video for the first time or seeking creative inspiration. Simple, open-ended prompts can generate more imaginative videos.",
            list: [
              "Formula: Prompt = Subject + Scene + Motion",
              "Subject: The main focus of the video (person, animal, object, etc.).",
              "Scene: The environment where the subject is situated.",
              "Motion: The subject's specific movements and general scene dynamics."
            ]
          },
          {
            subtitle: "Advanced Formula",
            text: "For users with some experience in AI video creation. Adding richer, more detailed descriptions enhances video quality, vividness, and storytelling.",
            list: [
              "Formula: Prompt = Subject (Subject Description) + Scene (Scene Description) + Motion (Motion Description) + Aesthetic Control + Stylization"
            ]
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Use Cases",
        content: [
          {
            subtitle: "Character-Driven Storytelling",
            text: "Excel at generating videos with complex human movements, athletic actions, and detailed facial expressions. Perfect for creating character-focused narratives, animated sequences, and story-driven content with recurring characters."
          },
          {
            subtitle: "Cinematic Sequences",
            text: "Leverage cinema-grade aesthetic control to create professional-looking sequences with precise lighting, color grading, and camera movements. Ideal for short films, music videos, and artistic projects requiring stylistic consistency."
          },
          {
            subtitle: "Multi-Subject Scenes",
            text: "Generate complex scenes with multiple subjects and accurate spatial relationships. Perfect for crowd scenes, group interactions, and scenarios requiring precise depiction of character interactions and movements."
          }
        ]
      },
      {
        title: "Practical Applications",
        content: [
          {
            subtitle: "Sports & Fitness Content",
            text: "Generate athletic movements and exercise demonstrations with fluid, natural motion. Create training videos, fitness content, and sports visualization with exceptional movement accuracy."
          },
          {
            subtitle: "Real-World Scenario Replication",
            text: "Replicate real-world scenarios through detailed text prompts. Perfect for simulation training, architectural walkthroughs, and visualizing concepts that require high spatial accuracy and realistic interactions."
          },
          {
            subtitle: "Artistic Exploration",
            text: "Experiment with different visual styles, from photorealistic to stylized artistic interpretations. Explore diverse aesthetics for concept art, visual development, and creative experimentation."
          }
        ]
      }
    ]
  },
  // --- NEW MODEL CONFIGURATION ---
  "wan-2.2": {
    id: "wan-2.2",
    displayName: "WAN 2.2 14B",
    description: "A 14B multimodal video model built for high-quality image→video and text→video outputs with an emphasis on cinematic sequences and efficient HD throughput. Strong at preserving photographic detail while adding controlled motion; suitable when image fidelity and audio synchronization matter more than ultra-low latency.",
    bannerImage: "/banners/wan-banner.jpg", // A wide, cinematic image
    cardVideo: "/videos/tron-1.mp4", // This is the video that will play on hover
    tags: ["new", "lora", "personalization"],
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
        defaultValue: "Commercial video photoshoot of a pair of shoes with tons of effect.",
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
        title: "Guideline",
        content: [
          {
            subtitle: "Image to Video with Controlled Motion",
            text: "This model excels at bringing a still image to life. Upload your source image and describe the scene you want to create. Use the 'Camera Motion' and 'Motion Strength' controls to guide the animation precisely."
          },
          {
            subtitle: "Fine-Tuning Your Output",
            text: "Higher 'Sample Steps' can lead to more detailed videos but will take longer to generate. 'Motion Strength' controls how dynamic the camera movement is."
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Use Cases",
        content: [
          {
            subtitle: "Product Visualization",
            text: "Transform static product photos into engaging video content. Perfect for e-commerce, creating dynamic product showcases with smooth camera movements highlighting features and details. Ideal for fashion items, electronics, and commercial products."
          },
          {
            subtitle: "Photorealistic Animation",
            text: "Bring still photographs to life with natural, fluid motion. Excels at maintaining visual quality and detail from the source image while adding realistic movement - perfect for human subjects, animals, and nature photography."
          },
          {
            subtitle: "Scene Transitions & Motion Graphics",
            text: "Create smooth transitions and animated sequences from design mockups or concept art. Ideal for architectural visualization, interior design presentations, and creative motion graphics projects."
          }
        ]
      },
      {
        title: "Creative Applications",
        content: [
          {
            subtitle: "Social Media Content",
            text: "Convert static posts into eye-catching video content for Instagram, TikTok, and other platforms. Generate dynamic visuals from photos to increase engagement and viewer retention."
          },
          {
            subtitle: "Character Consistency",
            text: "Maintain character identity and visual consistency across animated sequences. Perfect for storyboarding, creating character animations, and developing visual narratives with recurring subjects."
          },
          {
            subtitle: "High-Detail Rendering",
            text: "Generate high-quality videos with exceptional texture detail, smooth motion fluidity, and natural rendering. Best suited for projects where minor imperfections won't impact the final product and when processing time allows for quality over speed."
          }
        ]
      }
    ]
  },
  // --- NEW IMAGE MODEL CONFIGURATION ---
  "flux-kontext-pro": {
    id: "flux-kontext-pro",
    displayName: "FLUX Kontext Pro",
    description: "An image editing / image→image transformer tuned for precise, text-guided local edits while preserving overall scene context. Excels at selective changes (color swaps, local retouching, object replacement), consistent character/brand preservation across variants, and fast iterative editing workflows.",
    bannerImage: "/banners/wan-banner.jpg", // A wide, cinematic image
    cardVideo: "/videos/model-3.mp4", // This is the video that will play on hover
    tags: ["new", "lora", "personalization"],
    outputType: 'image', // Specify output type
    params: [
      {
        name: "input_image", 
        label: "Image",
        type: "image",
        defaultValue: null,
      },
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "Make the shoes and the full set white.",
      },
      {
        name: "aspect_ratio",
        label: "Aspect Ratio",
        type: "dropdown",
        defaultValue: "match_input_image",
        options: ["match_input_image","1:1", "16:9", "9:16", "4:3", "3:4"],
      },
    ],
    tips: [
      {
        title: "Guideline",
        content: [
          {
            subtitle: "Mastering the Prompt",
            text: "FLUX excels at interpreting detailed, photorealistic prompts. Describe the subject, setting, lighting, and camera angle for best results."
          }
        ]
      }
    ],
    useCases: [
      {
        title: "Use Cases",
        content: [
          {
            subtitle: "Targeted Image Editing",
            text: "FLUX Kontext Pro handles both text and reference images as inputs, enabling precise, local edits and complete scene transformations. Perfect for modifying specific elements while preserving the overall composition."
          },
          {
            subtitle: "Product Customization",
            text: "Quickly visualize product variations by changing colors, materials, or styles. Ideal for e-commerce businesses testing different product presentations, interior designers showing room variations, and fashion brands showcasing multiple colorways."
          },
          {
            subtitle: "Style Transfer & Transformation",
            text: "Transform existing images using text prompts to apply different artistic styles, lighting conditions, or atmospheric effects. Perfect for creative exploration and generating multiple variations from a single source image."
          }
        ]
      },
      {
        title: "Professional Design",
        content: [
          {
            subtitle: "Marketing Materials",
            text: "Create high-quality marketing visuals with exceptional text rendering and precise color control. Generate logos, promotional materials, social media content, and brand assets with photorealistic quality and accurate typography."
          },
          {
            subtitle: "UI/UX Design Mockups",
            text: "Generate professional website layouts, app interfaces, and design mockups quickly. Perfect for rapid prototyping, presenting multiple design concepts, and creating polished visual presentations for clients."
          },
          {
            subtitle: "Architectural Visualization",
            text: "Create detailed architectural renderings, interior design concepts, and property visualizations. Excellent for presenting design ideas, exploring different material choices, and generating client-ready presentations."
          }
        ]
      },
      {
        title: "Creative & Artistic",
        content: [
          {
            subtitle: "Digital Art Creation",
            text: "Generate high-quality digital artwork with 12 billion parameters delivering exceptional detail and clarity. Perfect for concept art, character design, fantasy illustrations, and creating portfolio-worthy pieces."
          },
          {
            subtitle: "Photography Enhancement",
            text: "Enhance existing photographs with AI-powered edits - adjust lighting, change backgrounds, add or remove elements, and apply creative effects while maintaining photorealistic quality."
          },
          {
            subtitle: "Brand Identity Development",
            text: "Develop consistent brand visuals using custom LoRA training. Teach FLUX your brand's style, ensuring every generated image aligns with your brand identity across all marketing materials."
          }
        ]
      }
    ]
  },
};