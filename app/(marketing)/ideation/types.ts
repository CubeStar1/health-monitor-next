export interface Storyboard {
  title: string;
  description: string;
  scenario: string;
}

export interface JourneyStage {
  stage: string;
  actions: string[];
  emotions: string;
  painPoints: string[];
  opportunities: string[];
}

export interface MindMapBranch {
  title: string;
  items: string[];
}

export interface StoryboardProps {
  storyboards: Storyboard[];
}

export interface JourneyProps {
  journeyStages: JourneyStage[];
}

export interface MindMapProps {
  branches: MindMapBranch[];
} 