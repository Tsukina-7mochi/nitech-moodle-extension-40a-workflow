export type Preferences = {
  // features for all pages
  removeForceDownload: {
    enabled: boolean;
  };
  replaceBreadcrumbCourseName: {
    enabled: boolean;
  };
  replaceNavigationCourseName: {
    enabled: boolean;
  };

  // features for dashboard page
  dashboardEventsCountdown: {
    enabled: boolean;
  };
  dashboardQuickCourseLinks: {
    enabled: boolean;
  };

  // video page
  scormAutoCollapseToc: {
    enabled: boolean;
  };
  scormAutoPlay: {
    enabled: boolean;
  };

  // login page
  loginAutoSubmit: {
    enabled: boolean;
  };
};
