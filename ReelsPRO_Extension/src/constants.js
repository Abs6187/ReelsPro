export const DEFAULT_SETTINGS = {
    status: true,
    blurryStartMode: true,
    blurAmount: 20,
    blurImages: true,
    blurVideos: true,
    blurMale: true,
    blurFemale: true,
    unblurImages: true,
    unblurVideos: true,
    gray: true,
    strictness: 0.5, // goes from 0 to 1
    whitelist: [],
    blurryStartTimeout: 7000, // milliseconds
};

export const STATUSES = {
    // the numbers are there to make it easier to sort
    ERROR: "-1ERROR",
    OBSERVED: "0OBSERVED",
    QUEUED: "1QUEUED",
    LOADING: "2LOADING",
    LOADED: "3LOADED",
    PROCESSING: "4PROCESSING",
    PROCESSED: "5PROCESSED",
    DISABLED: "9DISABLED",
};
