import { LucideProps, LucideIcon } from "lucide-react";

import { 
    LayoutDashboard,
    Cloud,
    Shield,
    Network,
    Settings,
    Brain,
    FileJson,
    History,
    Route,
    Scan,
    Lock,
    Activity,
    FileCheck,
    TreesIcon,
    BrainCircuit,
    Code2,
    Binary,
    GitBranch,
    FileIcon,
    User,
    Home
} from "lucide-react"

type IconType = {
    [key: string]: LucideIcon;
};

const Icons: IconType = {
    cloud: Cloud,
    shield: Shield,
    network: Network,
    settings: Settings,
    brain: Brain,
    fileJson: FileJson,
    history: History,
    route: Route,
    scan: Scan,
    lock: Lock,
    activity: Activity,
    fileCheck: FileCheck,
    treesIcon: TreesIcon,
    brainCircuit: BrainCircuit,
    code2: Code2,
    binary: Binary,
    gitBranch: GitBranch,
    fileIcon: FileIcon,
    layoutDashboard: LayoutDashboard,   
    user: User,
    home: Home
}

export default Icons;
