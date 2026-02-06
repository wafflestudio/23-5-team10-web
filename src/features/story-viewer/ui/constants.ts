export const STORY_VIEWER_UI = {
  STYLES: {
    CONTAINER:
      'relative flex h-screen w-screen items-center justify-center bg-[#1a1a1a] overflow-hidden',
    VIEWER_CARD:
      'relative aspect-[9/16] h-full max-h-[95vh] overflow-hidden rounded-xl bg-black shadow-2xl',
    OVERLAY_TOP:
      'absolute top-0 z-30 flex w-full flex-col gap-3 bg-gradient-to-b from-black/60 to-transparent p-4 pb-10',
    PROGRESS_CONTAINER: 'flex w-full gap-1',
    PROGRESS_BAR: 'h-0.5 flex-1 overflow-hidden rounded-full bg-white/30',
    PROGRESS_BAR_FILL:
      'h-full bg-white transition-all duration-100 ease-linear',
    HEADER: 'flex items-center justify-between',
    USER_SECTION: 'flex items-center gap-3',
    USER_INFO: 'flex items-center gap-2 text-[14px] font-medium text-white',
    CONTROL_SECTION: 'flex items-center gap-3',
    AVATAR: 'h-8 w-8 rounded-full border border-white/20 object-cover',
    CONTENT_AREA: 'h-full w-full select-none cursor-pointer',
  },
  MESSAGES: {
    TIME_AGO: '방금 전',
  },
} as const
