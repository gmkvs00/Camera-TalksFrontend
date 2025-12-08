import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const RouteProgress = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();

    setTimeout(() => {
      NProgress.done();
    }, 300); // small delay for smooth effect
  }, [location.pathname]);

  return null;
};

export default RouteProgress;
