import React from "react";
import {Composition} from "remotion";
import {DURATION_IN_FRAMES, FPS, Template} from "./template";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductLaunch"
        component={Template}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
