

export const routes = {
    "/": {
      name: "Home",
      path: "/",
    },
    "/dashboard": {
      name: "Dashboard",
      path: "/dashboard",
      description: "Proxy control and traffic monitoring",
    },
    "/flowchart": {
      name: "System Flow",
      path: "/flowchart",
      description: "Complete system workflow visualization",
    },
    "/logs": {
      name: "Raw Logs",
      path: "/logs",
      description: "View and analyze raw traffic logs",
    },
    "/labelling": {
      name: "Data Labelling",
      path: "/labelling",
      description: "Manual data labelling",
    },
    "/zsl": {
      name: "Zero-Shot Learning",
      path: "/zsl",
      description: "Zero-shot learning models",
      subRoutes: {
        "/zsl/deberta": {
          name: "DeBERTa Model",
          path: "/zsl/deberta",
          description: "DeBERTa-based classification",
        },
        "/zsl/codebert": {
          name: "CodeBERT Model",
          path: "/zsl/codebert",
          description: "CodeBERT-based classification",
        }
      }
    },
    "/random-forest": {
      name: "Random Forest",
      path: "/random-forest",
      description: "Random Forest classification",
    },
    "/settings": {
      name: "Settings",
      path: "/settings",
      description: "System configuration",
      subRoutes: {
        "/settings/analysis": {
          name: "Analysis Configuration",
          path: "/settings/analysis",
        },
        "/settings/scanning": {
          name: "Scanning Parameters",
          path: "/settings/scanning",
        },
        "/settings/thresholds": {
          name: "Detection Thresholds",
          path: "/settings/thresholds",
        }
      }
    }
  }