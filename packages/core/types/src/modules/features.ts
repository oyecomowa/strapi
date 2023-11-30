export interface FeaturesService {
  /**
   * This is the features.(js|ts) file in the user project.
   */
  config: {
    future: {
      contentReleases: boolean;
    };
  };
  future: {
    isEnabled: (futureFlagName: string) => boolean;
  };
}
