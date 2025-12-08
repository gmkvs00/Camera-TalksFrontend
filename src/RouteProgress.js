import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure once (module level)
NProgress.configure({
  showSpinner: false,
  trickle: true,
  trickleSpeed: 150,
  minimum: 0.15,
  easing: "ease",
  speed: 400,
});

const RouteProgress = () => {
  const { pathname } = useLocation();
  const startTimer = useRef(null);
  const doneTimer = useRef(null);
  const isStarted = useRef(false);

  useEffect(() => {
    // Clear old timers if any
    if (startTimer.current) clearTimeout(startTimer.current);
    if (doneTimer.current) clearTimeout(doneTimer.current);

    isStarted.current = false;

    // ⏳ 1) Small delay before showing bar (avoid flashing on very fast routes)
    startTimer.current = setTimeout(() => {
      NProgress.start();
      isStarted.current = true;

      // ⏱ 2) Ensure it stays visible for a bit for smooth feel
      doneTimer.current = setTimeout(() => {
        NProgress.done();
        isStarted.current = false;
      }, 450); // you can tweak this (350–500ms)
    }, 120); // delay before showing bar (80–150ms is good)

    return () => {
      if (startTimer.current) clearTimeout(startTimer.current);
      if (doneTimer.current) clearTimeout(doneTimer.current);

      if (isStarted.current) {
        NProgress.done(true);
        isStarted.current = false;
      }
    };
  }, [pathname]);

  return null;
};

export default RouteProgress;
