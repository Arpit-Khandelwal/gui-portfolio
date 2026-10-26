import { rotateStyle } from "./lid-layout";

interface LidSectionHeadProps {
  id: string;
  title: string;
  intro: string;
  /** Tilt of the bumper-sticker heading, in degrees. */
  rotate: number;
  tone?: "ink" | "lilac";
}

/** A section heading printed as a bumper sticker, with the intro beside it. */
export function LidSectionHead({ id, title, intro, rotate, tone = "ink" }: LidSectionHeadProps) {
  return (
    <div className="lid-head">
      <h2 id={id} className={`lid-head-title lid-head-title--${tone}`} style={rotateStyle(rotate)}>
        {title}
      </h2>
      <p className="lid-head-intro">{intro}</p>
    </div>
  );
}
