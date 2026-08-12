import React, {CSSProperties} from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  staticFile,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const FPS = 30;
export const DURATION_IN_FRAMES = 36 * FPS;

const C = {
  bg: "#02070b",
  text: "#f3f5f6",
  muted: "#8e969b",
  line: "rgba(226,232,235,0.52)",
  orange: "#d36a2d",
  white: "#f7f8f8",
};

const CENTER = {x: 820, y: 465};
const OUTER_R = 226;
const NODE_R = 53;

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], clamp);

const exit = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [1, 0], clamp);

const slideUp = (frame: number, start: number, end: number, distance = 35) =>
  interpolate(frame, [start, end], [distance, 0], {
    ...clamp,
    easing: ease,
  });

const baseText: CSSProperties = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  WebkitFontSmoothing: "antialiased",
  textRendering: "geometricPrecision",
  color: C.text,
  letterSpacing: "-0.02em",
};

function Background() {
  const frame = useCurrentFrame();

  const glowX = interpolate(frame, [0, DURATION_IN_FRAMES], [22, 31], clamp);
  const glowY = interpolate(frame, [0, DURATION_IN_FRAMES], [76, 62], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(
            ellipse 50% 78% at ${glowX}% ${glowY}%,
            rgba(181,72,29,0.72) 0%,
            rgba(91,57,45,0.42) 19%,
            rgba(26,38,47,0.68) 44%,
            rgba(2,7,11,0) 73%
          ),
          radial-gradient(
            ellipse 44% 66% at 29% 39%,
            rgba(26,42,54,0.66) 0%,
            rgba(2,7,11,0) 72%
          ),
          #02070b
        `,
        overflow: "hidden",
      }}
    >
      <AmbientParticles />
    </AbsoluteFill>
  );
}

function AmbientParticles() {
  const frame = useCurrentFrame();

  const particles = [
    [92, 118, 4, 0.8],
    [558, 112, 5, 1.15],
    [1452, 165, 4, 0.7],
    [1710, 285, 3, 1.2],
    [198, 720, 3, 0.95],
    [1540, 650, 4, 1.05],
    [1725, 885, 3, 0.8],
    [1020, 70, 3, 0.65],
  ] as const;

  return (
    <>
      {particles.map(([x, y, r, speed], i) => {
        const dy = Math.sin(frame / (28 / speed) + i * 1.7) * 12;
        const opacity =
          0.18 +
          0.32 *
            ((Math.sin(frame / (36 / speed) + i * 2.1) + 1) / 2);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + dy,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: C.white,
              opacity,
              filter: "blur(0.2px)",
            }}
          />
        );
      })}
    </>
  );
}

function FloatingCurves({intensity = 1}: {intensity?: number}) {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, DURATION_IN_FRAMES], [0, 18], clamp);

  return (
    <svg
      viewBox="0 0 1920 1080"
      width="100%"
      height="100%"
      style={{position: "absolute", inset: 0, opacity: 0.5 * intensity}}
    >
      <path
        d={`M 760 ${160 + drift}
            C 900 ${120 - drift}, 900 250, 850 330
            C 810 390, 780 430, 850 500`}
        fill="none"
        stroke="rgba(224,231,235,0.65)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={`M 1480 ${120 - drift}
            C 1580 150, 1570 310, 1690 390
            C 1760 438, 1800 450, 1860 470`}
        fill="none"
        stroke="rgba(224,231,235,0.45)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IntroWord({
  children,
  start,
  end,
}: {
  children: React.ReactNode;
  start: number;
  end: number;
}) {
  const frame = useCurrentFrame();
  const opacity = fade(frame, start, start + 16) * exit(frame, end - 12, end);
  const y = slideUp(frame, start, start + 20, 24);

  return (
    <div
      style={{
        ...baseText,
        position: "absolute",
        left: CENTER.x,
        top: 430,
        width: 520,
        textAlign: "center",
        fontSize: 60,
        fontWeight: 300,
        opacity,
        zIndex: 10,
        transform: `translateX(-50%) translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}

function AgenticTitle() {
  const frame = useCurrentFrame();
  const start = 4 * FPS;
  const opacity = fade(frame, start, start + 18) * exit(frame, 7.8 * FPS, 8.75 * FPS);
  const y = slideUp(frame, start, start + 22, 28);

  return (
    <div
      style={{
        ...baseText,
        position: "absolute",
        left: CENTER.x,
        top: 425,
        width: 700,
        textAlign: "center",
        fontSize: 56,
        fontWeight: 300,
        opacity,
        transform: `translateX(-50%) translateY(${y}px)`,
      }}
    >
      <span style={{color: C.text}}>agentic </span>
      <span style={{color: C.orange}}>AI</span>
      <span style={{color: C.text}}> copilots</span>
    </div>
  );
}

function TunnelTitle() {
  const frame = useCurrentFrame();
  const start = 8.0 * FPS;
  const end = 11.6 * FPS;
  const progress = interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.18, 0.86, 0.24, 1),
  });

  const opacity = fade(frame, start, start + 8) * exit(frame, end - 10, end);
  const p = progress;

  // The reference starts as five shallow, centered rectangles and then
  // pushes them toward camera while rotating/skewing the frame into a tunnel.
  const boxes = [
    {x: 325, y: 320, w: 995, h: 290},
    {x: 343, y: 334, w: 960, h: 255},
    {x: 360, y: 352, w: 925, h: 220},
    {x: 376, y: 370, w: 890, h: 186},
    {x: 393, y: 392, w: 855, h: 146},
  ];

  const textOpacity = fade(frame, start + 13, start + 30) * exit(frame, end - 16, end);

  const quadFor = (b: {x: number; y: number; w: number; h: number}, i: number) => {
    const x1 = b.x;
    const y1 = b.y;
    const x2 = b.x + b.w;
    const y2 = b.y + b.h;

    // Stronger perspective toward the end. Different depths get slightly
    // different tilt so the nested frames don't remain perfectly parallel.
    const tilt = p * (28 + i * 2.6);
    const rise = p * (58 + i * 4);
    const skew = p * (0.018 + i * 0.001);
    return [
      [x1 - tilt - skew * y1, y1 - rise],
      [x2 + tilt - skew * y1, y1 + rise * 0.35],
      [x2 + tilt + skew * y2, y2 + rise],
      [x1 - tilt + skew * y2, y2 - rise * 0.25],
    ];
  };

  return (
    <AbsoluteFill style={{opacity, zIndex: 5}}>
      <svg
        viewBox="0 0 1920 1080"
        width="100%"
        height="100%"
        style={{position: "absolute", inset: 0, overflow: "visible"}}
      >
        {boxes.map((b, i) => {
          const q = quadFor(b, i);
          const points = q.map(([x, y]) => `${x},${y}`).join(" ");
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke={`rgba(220,228,232,${0.72 - i * 0.06})`}
              strokeWidth={i === 0 ? 2 : 1.7}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      <div
        style={{
          ...baseText,
          position: "absolute",
          left: CENTER.x,
          top: 445,
          width: 720,
          textAlign: "center",
          fontSize: 34,
          fontWeight: 300,
          opacity: textOpacity,
          whiteSpace: "nowrap",
          transform: `translateX(-50%) scale(${interpolate(p, [0, 1], [0.84, 1.04], clamp)})`,
        }}
      >
        amplify human intelligence
      </div>
    </AbsoluteFill>
  );
}

function CopilotCircle({
  name,
  role,
  switchAt,
  transition = false,
}: {
  name: string;
  role: string;
  switchAt: number;
  transition?: boolean;
}) {
  const frame = useCurrentFrame();
  const start = switchAt * FPS;
  const local = frame - start;

  const appear = fade(frame, start, start + 12);
  const s = interpolate(local, [0, 18, 40], [0.52, 1.06, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const nameProgress = fade(frame, start + 4, start + 18);
  const roleOpacity = transition
    ? fade(frame, start + 18, start + 34)
    : fade(frame, start + 12, start + 28);
  const ringProgress = fade(frame, start, start + 24);

  return (
    <div
      style={{
        position: "absolute",
        left: CENTER.x,
        top: CENTER.y,
        width: OUTER_R * 2,
        height: OUTER_R * 2,
        transform: `translate(-50%, -50%) scale(${s})`,
        opacity: appear,
      }}
    >
      <svg width={OUTER_R * 2} height={OUTER_R * 2} style={{position: "absolute", inset: 0, overflow: "visible"}}>
        <circle
          cx={OUTER_R}
          cy={OUTER_R}
          r={OUTER_R - 1}
          fill="none"
          stroke="rgba(208,216,220,0.48)"
          strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * (OUTER_R - 1)}`}
          strokeDashoffset={`${2 * Math.PI * (OUTER_R - 1) * (1 - ringProgress)}`}
          transform={`rotate(-92 ${OUTER_R} ${OUTER_R})`}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 53,
          borderRadius: "50%",
          background: "linear-gradient(180deg, #ffffff 0%, #fdfdfd 69%, #e9eaeb 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 1px rgba(255,255,255,0.95)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            ...baseText,
            color: C.orange,
            fontSize: 64,
            lineHeight: 1,
            fontWeight: 300,
            letterSpacing: "-0.055em",
            opacity: nameProgress,
            transform: `translateX(${interpolate(nameProgress, [0,1], [-18,0], clamp)}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </div>
        <div
          style={{
            ...baseText,
            color: "#222528",
            fontSize: 18,
            marginTop: 7,
            letterSpacing: "-0.035em",
            opacity: roleOpacity,
            transform: `translateY(${interpolate(roleOpacity, [0,1], [6,0], clamp)}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {role}
        </div>
      </div>
    </div>
  );
}

type IconKind =
  | "flask"
  | "inventory"
  | "staffing"
  | "chart"
  | "patient"
  | "warning";

function Icon({kind}: {kind: IconKind}) {
  const common = {
    fill: "none",
    stroke: "#34383b",
    strokeWidth: 2.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "flask") {
    return (
      <svg viewBox="0 0 80 80" width="68" height="68">
        <path {...common} d="M31 10h18M36 10v18L21 54c-4 8 2 16 10 16h18c8 0 14-8 10-16L44 28V10" />
        <path {...common} d="M26 48c9-5 19 8 30 0" />
        <circle cx="35" cy="53" r="3" fill="#34383b" stroke="none" />
        <circle cx="46" cy="59" r="3" fill="#34383b" stroke="none" />
      </svg>
    );
  }

  if (kind === "inventory") {
    return (
      <svg viewBox="0 0 80 80" width="68" height="68">
        <path {...common} d="M10 22l15-9 15 9-15 9zM10 22v18l15 9 15-9V22" />
        <path {...common} d="M43 18h25v38H43zM49 25h13M49 34h13M49 43h6M58 43h4" />
      </svg>
    );
  }

  if (kind === "staffing") {
    return (
      <svg viewBox="0 0 80 80" width="68" height="68">
        <circle {...common} cx="26" cy="25" r="9" />
        <circle {...common} cx="54" cy="25" r="9" />
        <circle {...common} cx="40" cy="18" r="9" />
        <path {...common} d="M10 63c1-12 8-18 16-18s15 6 16 18M38 63c1-12 8-18 16-18s15 6 16 18M24 63c1-16 7-24 16-24s15 8 16 24" />
      </svg>
    );
  }

  if (kind === "chart") {
    return (
      <svg viewBox="0 0 80 80" width="68" height="68">
        <path {...common} d="M14 60V33M27 60V21M40 60V30M53 60V16" />
        <circle {...common} cx="52" cy="42" r="16" />
        <path {...common} d="M63 53l10 10M44 42c5-7 10-7 15-1" />
      </svg>
    );
  }

  if (kind === "patient") {
    return (
      <svg viewBox="0 0 80 80" width="68" height="68">
        <path {...common} d="M18 15h32v50H18zM28 15v-4h12v4" />
        <path {...common} d="M25 29h18M25 39h10M25 49h18" />
        <path {...common} d="M48 47l8-8 10 10-8 8z" />
        <path {...common} d="M57 40l7-7 7 7-7 7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" width="68" height="68">
      <path {...common} d="M40 11l28 51H12z" />
      <path {...common} d="M40 30v15M40 53v2" />
    </svg>
  );
}

type Feature = {
  title: string;
  body: string;
  kind: IconKind;
  x: number;
  y: number;
  tx: number;
  ty: number;
  anchor: "left" | "right";
  delay: number;
};

const STANLEY: Feature[] = [
  {
    title: "Inventory Optimization",
    body: "Forecasts reagent and supply needs\nto prevent stockouts or waste.",
    kind: "inventory",
    x: 435,
    y: 360,
    tx: 125,
    ty: 336,
    anchor: "right",
    delay: 0.35,
  },
  {
    title: "Test Volume Forecasting",
    body: "Predicts incoming workload trends\nto help plan ahead.",
    kind: "flask",
    x: 1188,
    y: 218,
    tx: 1252,
    ty: 181,
    anchor: "left",
    delay: 0.7,
  },
  {
    title: "Staffing Alignment",
    body: "Matches workforce levels with\npredicted demand.",
    kind: "staffing",
    x: 1078,
    y: 741,
    tx: 1150,
    ty: 718,
    anchor: "left",
    delay: 1.0,
  },
];

const MARIE: Feature[] = [
  {
    title: "Real-time Patient QC",
    body: "Evaluates patient results to\ndetect shifts early.",
    kind: "patient",
    x: 435,
    y: 360,
    tx: 125,
    ty: 336,
    anchor: "right",
    delay: 0.35,
  },
  {
    title: "Real-time QC Monitoring",
    body: "Applies Westgard and Six Sigma logic to\ntrack performance continuously.",
    kind: "chart",
    x: 1188,
    y: 218,
    tx: 1252,
    ty: 181,
    anchor: "left",
    delay: 0.7,
  },
  {
    title: "Proactive Issue Flagging",
    body: "Identifies potential problems before\npatients are affected.",
    kind: "warning",
    x: 1078,
    y: 741,
    tx: 1150,
    ty: 718,
    anchor: "left",
    delay: 1.0,
  },
];

function FeatureNode({
  feature,
  activeStart,
  activeEnd,
}: {
  feature: Feature;
  activeStart: number;
  activeEnd: number;
}) {
  const frame = useCurrentFrame();
  const start = activeStart * FPS + feature.delay * FPS;
  const end = activeEnd * FPS;

  const circleIn = fade(frame, start, start + 14);
  const titleIn = fade(frame, start + 7, start + 25);
  const bodyIn = fade(frame, start + 13, start + 31);
  const groupOut = exit(frame, end - 14, end);
  const scale = interpolate(frame, [start, start + 18], [0.72, 1], {
    ...clamp,
    easing: ease,
  });

  const dx = feature.x - CENTER.x;
  const dy = feature.y - CENTER.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const lineStartX = CENTER.x + ux * OUTER_R;
  const lineStartY = CENTER.y + uy * OUTER_R;
  const lineEndX = feature.x - ux * NODE_R;
  const lineEndY = feature.y - uy * NODE_R;
  const lineLength = Math.hypot(lineEndX - lineStartX, lineEndY - lineStartY);
  const lineProgress = fade(frame, start + 1, start + 18);

  const titleStyle: CSSProperties = {
    ...baseText,
    color: C.text,
    fontSize: 25,
    lineHeight: 1.02,
    fontWeight: 500,
    whiteSpace: "nowrap",
  };

  return (
    <>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: "absolute", inset: 0, overflow: "visible", opacity: groupOut}}>
        <line
          x1={lineStartX}
          y1={lineStartY}
          x2={lineEndX}
          y2={lineEndY}
          stroke="rgba(232,236,238,0.68)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeDasharray={lineLength}
          strokeDashoffset={lineLength * (1 - lineProgress)}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: feature.x,
          top: feature.y,
          width: NODE_R * 2,
          height: NODE_R * 2,
          borderRadius: "50%",
          background: "linear-gradient(180deg,#ffffff,#ededee)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(-50%,-50%) scale(${scale})`,
          opacity: circleIn * groupOut,
        }}
      >
        <Icon kind={feature.kind} />
      </div>

      <div
        style={{
          position: "absolute",
          left: feature.tx,
          top: feature.ty,
          width: 470,
          opacity: titleIn * groupOut,
          transform: `translateY(${interpolate(frame, [start + 7, start + 25], [9, 0], clamp)}px)`,
          textAlign: "left",
        }}
      >
        <div style={titleStyle}>{feature.title}</div>
        <div
          style={{
            ...baseText,
            color: "rgba(242,245,246,0.75)",
            fontSize: 15,
            lineHeight: 1.16,
            marginTop: 6,
            whiteSpace: "pre-line",
            opacity: bodyIn,
          }}
        >
          {feature.body}
        </div>
      </div>
    </>
  );
}

function FeatureScene({
  name,
  role,
  features,
  start,
  end,
  description,
}: {
  name: string;
  role: string;
  features: Feature[];
  start: number;
  end: number;
  description: string;
}) {
  const frame = useCurrentFrame();

  const sceneIn = fade(frame, start * FPS, start * FPS + 18);
  const sceneOut = exit(frame, (end - 0.5) * FPS, end * FPS);

  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <CopilotCircle name={name} role={role} switchAt={start} />

      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 125,
          top: 90,
          width: 660,
          fontSize: 16,
          lineHeight: 1.18,
          color: "rgba(239,243,245,0.78)",
          whiteSpace: "pre-line",
          opacity: fade(frame, start * FPS + 10, start * FPS + 30),
          clipPath: `inset(0 ${100 - fade(frame, start * FPS + 10, start * FPS + 40) * 100}% 0 0)`,
          filter: `blur(${interpolate(frame, [start * FPS + 10, start * FPS + 34], [1.6, 0], clamp)}px)`,
        }}
      >
        {description}
      </div>

      {features.map((feature) => (
        <FeatureNode
          key={feature.title}
          feature={feature}
          activeStart={start + 0.4}
          activeEnd={end}
        />
      ))}
    </AbsoluteFill>
  );
}

function TransitionCircle({name, role, start}: {name: string; role: string; start: number}) {
  const frame = useCurrentFrame();
  const opacity = fade(frame, start * FPS, start * FPS + 10) * exit(
    frame,
    (start + 1.7) * FPS,
    (start + 2.35) * FPS,
  );

  return (
    <div style={{opacity, position: "absolute", inset: 0}}>
      <CopilotCircle name={name} role={role} switchAt={start} transition />
    </div>
  );
}

export const Template: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Audio src={staticFile("voiceover.m4a")} volume={1} />
      <Background />
      <FloatingCurves intensity={0.9} />

      {/* 0–4s: "operations" */}
      <IntroWord start={0} end={3.8}>
        operations
      </IntroWord>

      {/* 4–8s: agentic AI copilots */}
      <AgenticTitle />

      {/* 8–10.7s: nested frame transition */}
      <TunnelTitle />

      {/* 10.7–12.7s: Stanley arrives */}
      <TransitionCircle name="Stanley" role="operations co-pilot" start={11.5} />

      {/* 12.7–22.2s */}
      <FeatureScene
        name="Stanley"
        role="operations co-pilot"
        start={12.9}
        end={22.2}
        description={
          "He forecasts test volumes, aligns staffing, and predicts\ninventory needs so you stay ahead of demand and cut\nwaste."
        }
        features={STANLEY}
      />

      {/* 22.2–24.8s: Stanley -> Marie */}
      <TransitionCircle name="Marie" role="quality co-pilot" start={22.2} />

      {/* 24.3–36s */}
      <FeatureScene
        name="Marie"
        role="quality co-pilot"
        start={24.0}
        end={35.7}
        description={
          "She monitors QC data and patient results in real time,\nspotting subtle drifts that lead to compliance\nissues and safeguarding accuracy, every result."
        }
        features={MARIE}
      />

      {/* final particle fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.bg,
          opacity: interpolate(
            frame,
            [35.7 * FPS, 36 * FPS],
            [0, 0.45],
            clamp,
          ),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export default Template;