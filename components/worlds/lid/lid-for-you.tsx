interface ForYouDotProps {
  /** Changes with the reader, so the dot remounts and slaps on again. */
  slapKey: string;
}

/** A small round sticker slapped on a build that matches the reader's pick. */
export function ForYouDot({ slapKey }: ForYouDotProps) {
  return (
    <span key={slapKey} className="lid-foryou lid-slap-in">
      For you
    </span>
  );
}
