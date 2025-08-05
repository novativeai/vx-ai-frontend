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
  params: ModelParameter[];
  tips?: TipSection[];
}

export const modelConfigs: { [key: string]: ModelConfig } = {
  "veo-3-fast": {
    id: "veo-3-fast",
    displayName: "VEO 3 Fast",
    params: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        defaultValue: "The white dragon warrior stands still, eyes full of determination and strength. The camera slowly moves closer or circles around the warrior, highlighting the powerful presence and heroic spirit of the character.",
      },
    ],
    tips: [
      {
        title: "📝 Prompting Basics for VEO 3",
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
    ]
  },
  "seedance-1-pro": {
    id: "seedance-1-pro",
    displayName: "Seedance-1 Pro",
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
      {
        name: "fps",
        label: "FPS",
        type: "slider",
        defaultValue: 24,
        min: 24,
        max: 60,
        step: 36,
      },
    ],
    tips: [
      {
        title: "🚀 Key Features",
        content: [
          {
            subtitle: "🎨 Cinema-Grade Aesthetic Control",
            text: "Integration of professional cinematography principles—including lighting, color, and cinematic language—allows for precise aesthetic control through multi-faceted keywords, resulting in visuals that are both stylistically diverse and rich in nuanced detail."
          },
          {
            subtitle: "🎭 Greatly Improved Complex Motion Generation",
            text: "Dynamic generation capabilities now enable precise control and stable generation of highly complex movements. This includes nuanced body motion, athletic actions, and detailed facial expressions. The resulting motion is exceptionally fluid, with details rendered in a natural and realistic manner."
          },
          {
            subtitle: "🌍 Enhanced Real-World Replication",
            text: "Featuring significantly more powerful semantic control and instruction-following capabilities. This update brings remarkable improvements in multi-subject generation, the depiction of interactions, and spatial accuracy within complex scenes. As a result, users can now reliably replicate real-world scenarios through text prompts."
          }
        ]
      },
      {
        title: "📝 Prompt Recipe Guide",
        content: [
          {
            subtitle: "🟢 Basic Formula",
            text: "For new users trying AI video for the first time or seeking creative inspiration. Simple, open-ended prompts can generate more imaginative videos.",
            list: [
              "Formula: Prompt = Subject + Scene + Motion",
              "Subject: The main focus of the video (person, animal, object, etc.).",
              "Scene: The environment where the subject is situated.",
              "Motion: The subject's specific movements and general scene dynamics."
            ]
          },
          {
            subtitle: "🔵 Advanced Formula",
            text: "For users with some experience in AI video creation. Adding richer, more detailed descriptions enhances video quality, vividness, and storytelling.",
            list: [
              "Formula: Prompt = Subject (Subject Description) + Scene (Scene Description) + Motion (Motion Description) + Aesthetic Control + Stylization"
            ]
          }
        ]
      }
    ]
  },
  // --- NEW MODEL CONFIGURATION ---
  "wan-2.2": {
    id: "wan-2.2",
    displayName: "WAN 2.2 14B",
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
    ],
    tips: [
      {
        title: "💡 Using WAN 2.2",
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
    ]
  },

};