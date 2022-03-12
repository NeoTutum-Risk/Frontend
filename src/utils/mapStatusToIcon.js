export const mapStatusToIcon = (status) => {
    switch (status) {
      case "archive":
        return "archive";
  
      case "commit":
        return "git-commit";
  
      case "changed":
        return "changes";
  
      case "closed":
        return "lock";

        case "close":
        return "lock";
  
      case "draft":
        return "draw";
  
      default:
        return "draw";
    }
  };